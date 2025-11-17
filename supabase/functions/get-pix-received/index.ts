import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { environment, startDate, endDate } = await req.json();
    
    console.log('Buscando PIX recebidos:', { environment, startDate, endDate });

    const clientId = Deno.env.get('BB_CLIENT_ID');
    const clientSecret = Deno.env.get('BB_CLIENT_SECRET');
    const developerAppKey = Deno.env.get('BB_DEVELOPER_APPLICATION_KEY');

    if (!clientId || !clientSecret || !developerAppKey) {
      throw new Error('Credenciais do Banco do Brasil não configuradas');
    }

    // URLs corretas do Banco do Brasil
    const oauthUrl = environment === 'sandbox'
      ? 'https://oauth.sandbox.bb.com.br'
      : 'https://oauth.hm.bb.com.br';

    const apiUrl = environment === 'sandbox'
      ? 'https://api.sandbox.bb.com.br'
      : 'https://api.hm.bb.com.br';

    const credentials = btoa(`${clientId}:${clientSecret}`);

    console.log('Gerando token OAuth2...');
    console.log(`URL OAuth: ${oauthUrl}/oauth/token`);
    console.log(`Client ID: ${clientId.substring(0, 8)}...`);
    
    // Parâmetros devem estar na query string conforme documentação do BB
    const tokenUrl = `${oauthUrl}/oauth/token?gw-dev-app-key=${developerAppKey}`;
    
    const tokenResponse = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
      }).toString(),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Erro ao obter token:', errorText);
      throw new Error(`Erro ao obter token: ${tokenResponse.status}`);
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;
    
    console.log('Token obtido com sucesso');
    console.log(`Token expira em: ${tokenData.expires_in} segundos`);

    // Agora busca os PIX recebidos
    // Formato das datas: ISO 8601 (2024-01-01T00:00:00Z)
    const pixUrl = `${apiUrl}/pix/v2/pix`;
    
    const params = new URLSearchParams({
      inicio: startDate,
      fim: endDate,
    });

    console.log(`Consultando PIX: ${pixUrl}?${params.toString()}`);
    console.log(`Usando gw-dev-app-key: ${developerAppKey.substring(0, 8)}...`);

    const pixResponse = await fetch(`${pixUrl}?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'gw-dev-app-key': developerAppKey,
        'Content-Type': 'application/json',
      },
    });

    if (!pixResponse.ok) {
      const errorText = await pixResponse.text();
      console.error('Erro ao buscar PIX:', errorText);
      console.error(`Status: ${pixResponse.status}`);
      console.error(`Headers:`, Object.fromEntries(pixResponse.headers.entries()));
      throw new Error(`Erro ao buscar PIX: ${pixResponse.status} - ${errorText}`);
    }

    const pixData = await pixResponse.json();
    
    console.log('Resposta da API PIX recebida');
    console.log(`PIX encontrados: ${pixData?.pix?.length || 0}`);
    
    // Se não houver PIX, retorna array vazio ao invés de erro
    if (!pixData.pix) {
      pixData.pix = [];
    }

    return new Response(
      JSON.stringify(pixData),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Erro ao buscar PIX recebidos:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Verifique as credenciais e o ambiente selecionado'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
