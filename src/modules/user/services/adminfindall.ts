/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { PrismaService } from '../../../prisma/prisma.service';
import { AuthUser } from '../../../interfaces/auth-user.interface';

export async function adminFindAll(prisma: PrismaService, user: AuthUser) {
  // ✅ 1. หา responsible ของ user
  const responsibles = await prisma.responsible.findMany({
    where: {
      userId: user.id,
    },
    select: {
      divisionId: true,
      officeId: true,
    },
  });

  // ✅ 2. แยก division / office
  const divisionIds = responsibles
    .map((r) => r.divisionId)
    .filter((id): id is number => id != null);

  const officeIds = responsibles
    .map((r) => r.officeId)
    .filter((id): id is number => id != null);

  // ✅ 3. สร้าง where dynamic
  let where: any = {
    status: 'A',
  };

  if (divisionIds.length) {
    // 👉 มี division → office ต้องเป็น null
    where = {
      employee: {
        divisionId: {
          in: divisionIds,
        },
        officeId: null,
      },
    };
  } else if (officeIds.length) {
    // 👉 มี office → division ต้องเป็น null
    where = {
      employee: {
        officeId: {
          in: officeIds,
        },
        divisionId: null,
      },
    };
  } else {
    // 👉 ไม่มีสิทธิ์เลย → return ว่าง
    return [];
  }

  // ✅ 4. สร้าง orderBy dynamic
  let orderBy: any;

  if (divisionIds.length) {
    orderBy = [
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
    ];
  } else {
    orderBy = [
      {
        employee: {
          office: {
            office_code: 'asc',
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
    ];
  }

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
