export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
      <h1 className="text-4xl font-bold mb-4">Estar Protegidos</h1>
      <p className="text-lg">Bienvenido a la app con Design System y tokens integrados.</p>
      <div className="mt-8 p-4 rounded bg-primary text-primary-foreground">
        Este bloque usa los tokens de color primario.
      </div>
    </main>
  );
}
