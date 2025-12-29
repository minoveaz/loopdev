export const LandingPage = () => {
  return (
    <div className="flex h-screen items-center justify-center bg-slate-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-slate-900">LoopDev OS</h1>
        <p className="mt-2 text-slate-600">Operating System for Digital Products</p>
        <div className="mt-6 flex flex-col gap-2">
          <a href="/demo-tenant/dashboard" className="text-blue-600 hover:underline font-medium">
            → Ir al Workspace del Cliente (Tenant)
          </a>
          <a href="/admin/architect" className="bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors inline-block mt-4">
            Abrir Architect Dashboard (Admin)
          </a>
        </div>
      </div>
    </div>
  )
}
