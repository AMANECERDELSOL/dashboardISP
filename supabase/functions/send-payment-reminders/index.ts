import { createClient } from 'npm:@supabase/supabase-js@2.74.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
}

interface WhatsAppMessageResponse {
  success: boolean
  messageId?: string
  error?: string
}

async function sendWhatsAppMessage(
  phoneNumber: string,
  customerName: string,
  megas: number,
  ipAddress: string
): Promise<WhatsAppMessageResponse> {
  const message = `Hola ${customerName},\n\nLe recordamos que su pago del servicio de internet está vencido.\n\n*Detalles del servicio:*\n📶 Plan: ${megas} MB\n🌐 IP Asignada: ${ipAddress}\n\nPara evitar la suspensión del servicio, favor de realizar su pago a la brevedad.\n\nGracias por su preferencia.\n\n- Skyweb`

  const cleanPhone = phoneNumber.replace(/[^0-9]/g, '')
  const whatsappNumber = cleanPhone.startsWith('521') ? cleanPhone : `521${cleanPhone}`

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`

  try {
    console.log(`WhatsApp link generado para ${customerName} (${whatsappNumber})`)
    console.log(`URL: ${whatsappUrl}`)

    return {
      success: true,
      messageId: whatsappUrl  // Return the URL as messageId so it can be used
    }
  } catch (error) {
    console.error('Error preparando mensaje de WhatsApp:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    }
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    const { data: customers, error } = await supabaseClient
      .from('customers')
      .select('*')
      .eq('estado_pago', 'Vencido')

    if (error) throw error

    if (!customers || customers.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'No hay clientes con pagos vencidos',
          count: 0
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        },
      )
    }

    const whatsappPromises = customers.map(async (customer) => {
      const result = await sendWhatsAppMessage(
        customer.telefono,
        customer.nombre_cliente,
        customer.megas_contratados,
        customer.ip_asignada
      )

      return {
        customer_id: customer.id,
        phone: customer.telefono,
        name: customer.nombre_cliente,
        success: result.success,
        messageId: result.messageId,
        error: result.error
      }
    })

    const results = await Promise.all(whatsappPromises)
    const successfulMessages = results.filter(r => r.success)

    if (successfulMessages.length > 0) {
      const { error: reminderError } = await supabaseClient
        .from('payment_reminders')
        .insert(
          successfulMessages.map(result => ({
            customer_id: result.customer_id,
            reminder_date: new Date().toISOString(),
            sent: true,
            message: `Recordatorio enviado vía WhatsApp al ${result.phone}`
          }))
        )

      if (reminderError) {
        console.error('Error registrando recordatorios:', reminderError)
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Recordatorios preparados para ${successfulMessages.length} de ${customers.length} clientes`,
        details: results
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error en la función:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
