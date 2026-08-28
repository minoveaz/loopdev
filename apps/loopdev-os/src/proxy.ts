import { NextResponse, type NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === '/composition-showcase/certification-lab/data-tables') {
    const url = request.nextUrl.clone();
    url.pathname = '/composition-showcase';
    url.searchParams.set('recipe', 'CertificationLab');
    url.searchParams.set('component', 'FiltersActions');
    return NextResponse.rewrite(url);
  }

  if (request.nextUrl.pathname === '/composition-showcase/certification-lab/UI-foundation') {
    const url = request.nextUrl.clone();
    url.pathname = '/composition-showcase';
    url.searchParams.set('recipe', 'CertificationLab');
    url.searchParams.set('component', 'UI-foundation');
    return NextResponse.rewrite(url);
  }

  if (request.nextUrl.pathname === '/composition-showcase/certification-lab/CRMPrimitives') {
    const url = request.nextUrl.clone();
    url.pathname = '/composition-showcase';
    url.searchParams.set('recipe', 'CertificationLab');
    url.searchParams.set('component', 'CRMPrimitives');
    return NextResponse.rewrite(url);
  }

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
