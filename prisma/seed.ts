import 'dotenv/config';
import { PrismaService } from '../src/prisma/prisma.service';

// Sync service imports (Required to populate master data tables so employee foreign keys don't fail)
import { createDepartment } from '../src/modules/department/services/create';
import { createDivision } from '../src/modules/division/services/create';
import { createOffice } from '../src/modules/office/services/create';
import { createUnit } from '../src/modules/unit/services/create';
import { createPositionGroup } from '../src/modules/positiongroup/services/create';
import { createPositionCode } from '../src/modules/positioncode/services/create';
import { createPosition } from '../src/modules/position/services/create';
import { createEmployee } from '../src/modules/employee/services/create';
import { createUser } from '../src/modules/user/services/create';

async function main() {
  const prisma = new PrismaService();

  console.log('Start seeding...');

  try {
    // 1. Seed Roles
    console.log('Seeding roles...');
    const roles = [
      { id: 1, name: 'Super Admin', description: '' },
      { id: 2, name: 'Admin', description: '' },
      { id: 3, name: 'User', description: '' },
    ];
    for (const r of roles) {
      await prisma.role.upsert({
        where: { id: r.id },
        update: { name: r.name, description: r.description },
        create: { id: r.id, name: r.name, description: r.description },
      });
    }

    console.log('Syncing departments...');
    await createDepartment(prisma);

    console.log('Syncing divisions...');
    await createDivision(prisma);

    console.log('Syncing offices...');
    await createOffice(prisma);

    console.log('Syncing units...');
    await createUnit(prisma);

    console.log('Syncing position groups...');
    await createPositionGroup(prisma);

    console.log('Syncing position codes...');
    await createPositionCode(prisma);

    console.log('Syncing positions...');
    await createPosition(prisma);

    console.log('Syncing employees...');
    await createEmployee(prisma);

    console.log('Syncing users...');
    await createUser(prisma);

    console.log('Updating user 40607 to Super Admin (roleId = 1)...');
    await prisma.user.updateMany({
      where: { username: '40607' },
      data: { roleId: 1 },
    });
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();

//npx prisma db seed
