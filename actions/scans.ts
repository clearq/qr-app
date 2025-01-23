import { prisma } from "@/lib/db";
import { Scan } from "@prisma/client";

interface MonthlyCounts {
  [month: string]: {
    url: number;
    vcard: number;
    product: number;
    ticket: number;
  };
}
interface VcardMonthlyCounts {
  [month: string]: {
    vcard: number;
  };
}

export async function getMonthlyCounts() {
  const result = await prisma.scan.groupBy({
    by: ["scannedAt", "type"],
    _count: {
      _all: true,
    },
    _min: {
      scannedAt: true,
    },
    orderBy: {
      _min: {
        scannedAt: "asc",
      },
    },
  });

  const monthFormatter = new Intl.DateTimeFormat("en-US", { month: "long" });

  const groupedByMonth = result.reduce((acc: MonthlyCounts, curr) => {
    if (!curr._min.scannedAt) {
      return acc;
    }

    const month = monthFormatter.format(curr._min.scannedAt);

    if (!acc[month]) {
      acc[month] = { url: 0, vcard: 0, product: 0, ticket: 0 };
    }

    if (curr.type === 0) {
      acc[month].url += curr._count._all || 0;
    } else if (curr.type === 1) {
      acc[month].vcard += curr._count._all || 0;
    } else if (curr.type === 4) {
      acc[month].ticket += curr._count._all || 0;
    } else if (curr.type === 5) {
      acc[month].product += curr._count._all || 0;
    }

    return acc;
  }, {} as MonthlyCounts);

  return Object.entries(groupedByMonth).map(([month, counts]) => ({
    month,
    url: counts.url,
    vcard: counts.vcard,
    ticket: counts.ticket,
    product: counts.product,
  }));
}

export async function getVcardMonthlyCounts() {
  const result = await prisma.scan.groupBy({
    by: ["scannedAt", "type"],
    _count: {
      _all: true,
    },
    _min: {
      scannedAt: true,
    },
    orderBy: {
      _min: {
        scannedAt: "asc",
      },
    },
  });

  const monthFormatter = new Intl.DateTimeFormat("en-US", { month: "long" });

  const groupedByMonth = result.reduce((acc: VcardMonthlyCounts, curr) => {
    if (!curr._min.scannedAt) {
      return acc;
    }

    const month = monthFormatter.format(curr._min.scannedAt);

    if (!acc[month]) {
      acc[month] = { vcard: 0 };
    }

    // Only count vCards, not QR codes
    if (curr.type === 1) {
      acc[month].vcard += curr._count._all || 0;
    }

    return acc;
  }, {} as VcardMonthlyCounts);

  return Object.entries(groupedByMonth).map(([month, counts]) => ({
    month,
    vcard: counts.vcard,
  }));
}

export function groupScansByMonth(scans: Scan[]) {
  const monthFormatter = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  });

  return scans.reduce((acc, scan) => {
    const month = monthFormatter.format(scan.scannedAt);

    if (!acc[month]) {
      acc[month] = [];
    }

    acc[month].push(scan);
    return acc;
  }, {} as Record<string, Scan[]>); // Group scans by month as a key-value pair
}

export async function getMonthlyCountsForVcard(id: string) {
  const result = await prisma.scan.groupBy({
    by: ["scannedAt"],
    where: {
      profileId: id,
      type: 1, // Only VCard type scans
    },
    _count: {
      _all: true,
    },
    _min: {
      scannedAt: true,
    },
    orderBy: {
      _min: {
        scannedAt: "asc",
      },
    },
  });

  const monthFormatter = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  });

  const groupedByMonth = result.reduce((acc, curr) => {
    if (!curr._min.scannedAt) return acc;

    const month = monthFormatter.format(curr._min.scannedAt);

    if (!acc[month]) {
      acc[month] = 0;
    }

    acc[month] += curr._count._all;

    return acc;
  }, {} as Record<string, number>);

  return groupedByMonth;
}
