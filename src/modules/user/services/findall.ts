import { PrismaService } from '../../../prisma/prisma.service';
import { Prisma } from '../../../../generated/prisma/client';

export interface FindAllUserOptions {
  page?: number;
  limit?: number;
  search?: string;
  roleId?: number;
  status?: string;
  departmentId?: number;
  divisionId?: number;
  posId?: number;
}

export async function findAllUser(
  prisma: PrismaService,
  options: FindAllUserOptions = {},
) {
  const where: Prisma.UserWhereInput = {};

  if (options.roleId !== undefined && options.roleId !== null) {
    where.roleId = Number(options.roleId);
  }

  if (options.status) {
    let statusValue = options.status;
    if (statusValue === 'Active') statusValue = 'A';
    if (statusValue === 'Inactive') statusValue = 'C';
    where.status = statusValue;
  }

  const employeeWhere: Prisma.EmployeeWhereInput = {};

  if (options.departmentId !== undefined && options.departmentId !== null) {
    employeeWhere.departmentId = Number(options.departmentId);
  }

  if (options.divisionId !== undefined && options.divisionId !== null) {
    employeeWhere.divisionId = Number(options.divisionId);
  }

  if (options.posId !== undefined && options.posId !== null) {
    employeeWhere.posId = Number(options.posId);
  }

  if (options.search) {
    const searchLower = options.search.trim();
    if (searchLower) {
      where.OR = [
        { username: { contains: searchLower, mode: 'insensitive' } },
        {
          employee: {
            OR: [
              { first_name: { contains: searchLower, mode: 'insensitive' } },
              { last_name: { contains: searchLower, mode: 'insensitive' } },
              { emp_code: { contains: searchLower, mode: 'insensitive' } },
              { tel: { contains: searchLower, mode: 'insensitive' } },
              { email: { contains: searchLower, mode: 'insensitive' } },
            ],
          },
        },
      ];
    }
  }

  if (Object.keys(employeeWhere).length > 0) {
    where.employee = {
      ...(where.employee as Prisma.EmployeeWhereInput),
      ...employeeWhere,
    };
  }

  const page = options.page ? Number(options.page) : undefined;
  const limit = options.limit ? Number(options.limit) : undefined;

  const select = {
    id: true,
    username: true,
    employeeId: true,
    status: true,
    roleId: true,
    role: true,
    employee: {
      include: {
        department: true,
        division: true,
        office: true,
        unit: true,
        position: true,
      },
    },
  };

  const orderBy: Prisma.UserOrderByWithRelationInput[] = [
    {
      employee: {
        position: {
          poscodeId: 'asc',
        },
      },
    },
    {
      employee: {
        division: {
          division_code: 'asc',
        },
      },
    },
    {
      id: 'asc',
    },
  ];

  if (page !== undefined && limit !== undefined) {
    const skip = (page - 1) * limit;
    const take = limit;

    const [data, total] = await Promise.all([
      prisma.user.findMany({
        where,
        orderBy,
        select,
        skip,
        take,
      }),
      prisma.user.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      total,
      page,
      limit,
      totalPages,
    };
  }

  return prisma.user.findMany({
    where,
    orderBy,
    select,
  });
}
