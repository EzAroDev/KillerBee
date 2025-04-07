export default function UnauthorizedPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#0b0c0d] text-[#f1f1f1] px-4">
      <h1 className="text-4xl font-bold text-[#FFD700] mb-4">Accès refusé</h1>
      <p className="text-lg text-center max-w-xl">
        Vous n’avez pas les permissions nécessaires pour accéder à cette page.
      </p>
    </main>
  );
}
