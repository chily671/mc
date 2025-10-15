import TitleDetailClient from "./TitleDetailClient";

export default async function TitleDetailPage({ params }) {
  const resolvedParams = await params; // unwrap Promise
  const id = resolvedParams.id;

  return <TitleDetailClient id={id} />;
}
