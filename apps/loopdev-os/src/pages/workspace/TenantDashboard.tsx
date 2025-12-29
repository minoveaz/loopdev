import { useParams } from 'react-router-dom';

export const TenantDashboard = () => {
  const { tenantId } = useParams();
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Bienvenido a {tenantId}</h1>
      <p className="text-gray-600">Este es el espacio de trabajo privado del cliente.</p>
    </div>
  )
}
