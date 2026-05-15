import { PrismaService } from '../../../prisma/prisma.service';
import { externalApi } from '../../../utils/external-api';

interface Employee {
  id: number;
  first_name: string;
  last_name: string;
  emp_code: string;
  status: string;
  gender: string;
  tel: string;
  email: string;
  empimg: string;
  posId: number;
  departmentId: number;
  divisionId: number;
  officeId: number;
  unitId: number;
}

async function fetchEmployees(): Promise<Employee[]> {
  try {
    const response = await externalApi.get<Employee[]>('/employees');

    return response.data;
  } catch (err: unknown) {
    let message = 'Failed to fetch employees';
    if (err instanceof Error) message = err.message;
    console.error(message);
    throw new Error(message);
  }
}

function chunkArray<T>(array: T[], size: number): T[][] {
  const result: T[][] = [];

  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }

  return result;
}

export async function createEmployee(
  prisma: PrismaService,
  // createUnitDto: CreateUnitDto,
) {
  const employeesData = await fetchEmployees();

  if (!employeesData?.length) {
    throw new Error('No employees data retrieved from external API');
  }

  const existing = await prisma.employee.findMany({
    select: { id: true },
  });

  const existingIds = new Set(existing.map((d) => d.id));

  let updated = 0;
  let created = 0;

  const batchSize = 50;
  const batches = chunkArray(employeesData, batchSize);

  for (const batch of batches) {
    // 🔹 รัน sequential แทน Promise.all
    for (const d of batch) {
      const isNew = !existingIds.has(d.id);

      if (isNew) created++;
      else updated++;

      await prisma.employee.upsert({
        where: { id: d.id },
        update: {
          first_name: d.first_name,
          last_name: d.last_name,
          emp_code: d.emp_code,
          status: d.status,
          gender: d.gender,
          tel: d.tel,
          email: d.email,
          empimg: d.empimg,
          posId: d.posId,
          departmentId: d.departmentId,
          divisionId: d.divisionId,
          officeId: d.officeId,
          unitId: d.unitId,
        },
        create: {
          id: d.id,
          first_name: d.first_name,
          last_name: d.last_name,
          emp_code: d.emp_code,
          status: d.status,
          gender: d.gender,
          tel: d.tel,
          email: d.email,
          empimg: d.empimg,
          posId: d.posId,
          departmentId: d.departmentId,
          divisionId: d.divisionId,
          officeId: d.officeId,
          unitId: d.unitId,
        },
      });
    }
  }

  return {
    success: true,
    total: employeesData.length,
    updated,
    created,
    message: 'Employee synced successfully',
  };
}
