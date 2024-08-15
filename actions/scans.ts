import { prisma } from "@/lib/db";

interface MonthlyCounts {
  [month: string]: {
    url: number;
    vcard: number;
  };
}
interface VcardMonthlyCounts {
  [month: string]: {
    vcard: number;
  };
}

export async function getMonthlyCounts() {
  const result = await prisma.scan.groupBy({
    by: ['scannedAt', 'type'],
    _sum: {
      count: true
    },
    _min: {
      scannedAt: true
    },
    orderBy: {
      _min: {
        scannedAt: 'asc'
      }
    }
  });

  const monthFormatter = new Intl.DateTimeFormat('en-US', { month: 'long' });


  const groupedByMonth = result.reduce((acc: MonthlyCounts, curr) => {
    if (!curr._min.scannedAt) {
      return acc;
    }

    const month = monthFormatter.format(curr._min.scannedAt);

    if (!acc[month]) {
      acc[month] = { url: 0, vcard: 0 };
    }

    if (curr.type === 0) {
      acc[month].url += curr._sum.count || 0;
    } else {
      acc[month].vcard += curr._sum.count || 0;
    }

    return acc;
  }, {});

  return Object.entries(groupedByMonth).map(([month, counts]) => ({
    month,
    url: counts.url,
    vcard: counts.vcard
  }));
}


export async function getVcardMonthlyCounts() {
  const result = await prisma.scan.groupBy({
    by: ['scannedAt', 'type'],
    _sum: {
      count: true
    },
    _min: {
      scannedAt: true
    },
    orderBy: {
      _min: {
        scannedAt: 'asc'
      }
    }
  });

  const monthFormatter = new Intl.DateTimeFormat('en-US', { month: 'long' });


  const groupedByMonth = result.reduce((acc: VcardMonthlyCounts, curr) => {
    if (!curr._min.scannedAt) {
      return acc;
    }

    const month = monthFormatter.format(curr._min.scannedAt);

    if (!acc[month]) {
      acc[month] = { vcard: 0 };
    }

    if (curr.type === 0) {
      acc[month].vcard += curr._sum.count || 0;
    }

    return acc;
  }, {});

  return Object.entries(groupedByMonth).map(([month, counts]) => ({
    month,
    vcard: counts.vcard
  }));
}
