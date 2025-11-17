import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { environment } = await req.json();
    
    const clientId = Deno.env.get('BB_CLIENT_ID');
    const clientSecret = Deno.env.get('BB_CLIENT_SECRET');
    const developerAppKey = Deno.env.get('BB_DEVELOPER_APPLICATION_KEY');

    if (!clientId || !clientSecret || !developerAppKey) {
      throw new Error('Credenciais do Banco do Brasil não configuradas');
    }

    // URL correta do OAuth2 do Banco do Brasil
    const oauthUrl = environment === 'sandbox'
      ? 'https://oauth.hm.bb.com.br'
      : 'https://oauth.bb.com.br';

    console.log(`Gerando token para ambiente: ${environment}`);
    console.log(`URL: ${oauthUrl}/oauth/token`);

    // Codifica as credenciais em Base64
    const credentials = btoa(`${clientId}:${clientSecret}`);

    // Parâmetros devem estar na query string conforme documentação do BB
    const tokenUrl = `${oauthUrl}/oauth/token?gw-dev-app-key=${developerAppKey}`;

    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
      }).toString(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erro na resposta do BB:', errorText);
      throw new Error(`Erro ao obter token: ${response.status} - ${errorText}`);
    }

    const tokenData: TokenResponse = await response.json();
    
    console.log('Token gerado com sucesso');
    console.log(`Expira em: ${tokenData.expires_in} segundos`);

    return new Response(
      JSON.stringify({
        token: tokenData.access_token,
        expiresIn: tokenData.expires_in,
        environment,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Erro ao gerar token:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Verifique se as credenciais do Banco do Brasil estão corretas'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
