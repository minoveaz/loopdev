import { NextResponse, type NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  // Pasar rápidamente sin hacer nada
  return NextResponse.next({ request });
}

export const config = {
  matcher: [
    /*
     * Excluir paths que no necesitan procesamiento
     */
    '/((?!_next|static|favicon.ico|api|.*\\.[\\w]+$).*)',
  ],
};
