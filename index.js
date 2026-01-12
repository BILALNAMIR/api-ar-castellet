import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { createClient } from '@supabase/supabase-js'


const app = express()
app.use(express.json())


// Variables d'entorn
const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY


// Connexió a Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)


//permet cors (cal per fer peticions en local)
app.use(cors())


// Ruta test
app.get('/', (req, res) => {
  res.send('API funcionant!')
})




// Endpoint per crear una nova partida
app.get("/novapartida", async (req, res) => {
  try {
    // 1. Consultem el número actual
    const { data, error: errorSelect } = await supabase
      .from("CodiPartida")
      .select("numero")
      .limit(1)
      .single()


    if (errorSelect) {
      return res.status(500).json({ error: errorSelect.message })
    }


    const numeroActual = data.numero
    const nouNumero = numeroActual + 1


    // 2. Actualitzem el número (usem eq(numeroActual) per trobar la fila)
    const { error: errorUpdate } = await supabase
      .from("CodiPartida")
      .update({ numero: nouNumero })
      .eq("numero", numeroActual)


    if (errorUpdate) {
      return res.status(500).json({ error: errorUpdate.message })
    }


    // 3. Retornem el nou número
    res.json({ CodiPartida: nouNumero })


  } catch (e) {
    res.status(500).json({ error: "Error intern", detalls: e.message })
  }
})




//INICIAR SERVIDOR
app.listen(3000, () => {
  console.log('Servidor escoltant al port 3000')
})








