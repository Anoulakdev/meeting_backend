import { PrismaService } from '../../../prisma/prisma.service';
import { AuthUser } from '../../../interfaces/auth-user.interface';

export async function adminFindAll(prisma: PrismaService, user: AuthUser) {
  // ✅ 1. กรณี Superadmin (Role 1) ให้สามารถเข้าถึงผู้ใช้งานที่ Active ทั้งหมดได้
  if (user.roleId === 1) {
    return prisma.user.findMany({
      where: { status: 'A' },
      orderBy: [
        {
          employee: {
            division: {
              division_code: 'asc',
            },
          },
        },
        {
          employee: {
            position: {
              poscodeId: 'asc',
            },
          },
        },
        {
          id: 'asc',
        },
      ],
      select: {
        id: true,
        username: true,
        employeeId: true,
        roleId: true,
        status: true,
        employee: {
          include: {
            department: true,
            division: true,
            office: true,
            unit: true,
            position: true,
          },
        },
      },
    });
  }

  // ✅ 2. หา responsible ของ user (Role 2)
  const responsibles = await prisma.responsible.findMany({
    where: {
      userId: user.id,
    },
    select: {
      divisionId: true,
      officeId: true,
    },
  });

  const divisionIds = responsibles
    .map((r) => r.divisionId)
    .filter((id): id is number => id != null);

  const officeIds = responsibles
    .map((r) => r.officeId)
    .filter((id): id is number => id != null);

  // ✅ 3. รวมเงื่อนไข division และ office ด้วย OR เพื่อไม่ให้ข้อมูลตกหล่น
  const employeeConditions: any[] = [];

  if (divisionIds.length) {
    employeeConditions.push({
      divisionId: { in: divisionIds },
    });
  }

  if (officeIds.length) {
    employeeConditions.push({
      officeId: { in: officeIds },
    });
  }

  if (employeeConditions.length === 0) {
    // ไม่มีสิทธิ์ความรับผิดชอบใดๆ คืนค่าว่าง
    return [];
  }

  const where = {
    status: 'A',
    employee:
      employeeConditions.length === 1
        ? employeeConditions[0]
        : { OR: employeeConditions },
  };

  // ✅ 4. สร้าง orderBy dynamic
  const orderBy: any = [
    {
      employee: {
        division: {
          division_code: 'asc',
        },
      },
    },
    {
      employee: {
        position: {
          poscodeId: 'asc',
        },
      },
    },
    {
      id: 'asc',
    },
  ];

  // ✅ 5. query
  return prisma.user.findMany({
    where,
    orderBy,
    select: {
      id: true,
      username: true,
      employeeId: true,
      roleId: true,
      status: true,
      employee: {
        include: {
          department: true,
          division: true,
          office: true,
          unit: true,
          position: true,
        },
      },
    },
  });
}
