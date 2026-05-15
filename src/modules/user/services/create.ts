import { InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { externalApi } from '../../../utils/external-api';
import * as bcrypt from 'bcryptjs';

interface EmployeeFromApi {
  emp_code: string;
}

/* =======================
   Fetch Employees from API
======================= */

async function fetchEmployees(): Promise<EmployeeFromApi[]> {
  try {
    const response = await externalApi.get<EmployeeFromApi[]>('/employees');

    return response.data;
  } catch (err: unknown) {
    let message = 'Failed to fetch employees';
    if (err instanceof Error) message = err.message;

    console.error(message);
    throw new Error(message);
  }
}

/* =======================
   Create Users from Employees
======================= */

export async function createUser(prisma: PrismaService) {
  const employeesFromApi = await fetchEmployees();

  if (!employeesFromApi.length) {
    throw new Error('No employees data retrieved from external API');
  }

  // 🔹 employee ใน DB
  const employeesInDb = await prisma.employee.findMany({
    select: {
      id: true,
      emp_code: true,
    },
  });

  // 🔹 map emp_code → employee.id
  const employeeMap = new Map<string, number>(
    employeesInDb.map((e) => [e.emp_code, e.id]),
  );

  // 🔹 users ที่มีอยู่แล้ว
  const existingUsers = await prisma.user.findMany({
    select: { username: true },
  });
  const existingUsernames = new Set(existingUsers.map((u) => u.username));

  if (!process.env.DEFAULT_PASSWORD) {
    throw new InternalServerErrorException('DEFAULT_PASSWORD is not defined');
  }

  const hashedPassword = await bcrypt.hash(process.env.DEFAULT_PASSWORD, 10);

  let created = 0;
  let skipped = 0;

  // 🔹 batch size
  const batchSize = 50;
  for (let i = 0; i < employeesFromApi.length; i += batchSize) {
    const batch = employeesFromApi.slice(i, i + batchSize);

    // sequential loop ภายใน batch
    for (const emp of batch) {
      const employeeId = employeeMap.get(emp.emp_code);

      // ❌ ไม่มี employee ใน DB
      if (!employeeId) {
        console.warn(`Skip: employee not found for emp_code = ${emp.emp_code}`);
        skipped++;
        continue;
      }

      // ❌ user มีแล้ว
      if (existingUsernames.has(emp.emp_code)) {
        skipped++;
        continue;
      }

      await prisma.user.create({
        data: {
          username: emp.emp_code,
          password: hashedPassword,
          employeeId: employeeId,
          roleId: 3, // default role
        },
      });

      created++;
    }
  }

  return {
    success: true,
    totalFromApi: employeesFromApi.length,
    created,
    skipped,
    message: 'Users synced successfully',
  };
}
