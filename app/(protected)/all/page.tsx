import AllForm from "@/components/all-form";

export default function All({
  searchParams,
}: {
  searchParams: { id: string };
}) {
  return <AllForm id={searchParams.id} />;
}
