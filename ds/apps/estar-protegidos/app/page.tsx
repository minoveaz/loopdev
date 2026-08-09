export default function Home() {
  return (
    <main className="bg-background text-foreground flex min-h-screen flex-col items-center justify-center">
      <h1 className="mb-4 text-4xl font-bold">Estar Protegidos</h1>
      <p className="text-lg">Bienvenido a la app con Design System y tokens integrados.</p>
      <div className="bg-primary text-primary-foreground mt-8 rounded p-4">
        Este bloque usa los tokens de color primario.
      </div>
    </main>
  );
}
