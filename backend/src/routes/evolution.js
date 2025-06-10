const express = require('express')
const axios = require('axios')
const router = express.Router()

// Configurações da API
const API_BASE_URL = 'http://localhost:8080'
const API_KEY = '918f5b02-766e-4107-9c96-9451f251cfde'

// Headers padrão para requisições
const getHeaders = () => ({
    'apikey': API_KEY,
    'Content-Type': 'application/json'
})

// Função para validar dados da requisição de criação de instância
function validateCreateInstanceRequest(data) {
    const errors = []

    if (!data.user_name || typeof data.user_name !== 'string' || !data.user_name.trim()) {
        errors.push('user_name é obrigatório e deve ser uma string válida.')
    }

    return errors
}

// Função para validar dados da requisição de envio de mensagem
function validateSendMessageRequest(data) {
    const errors = []

    if (!data.instance_name || typeof data.instance_name !== 'string' || !data.instance_name.trim()) {
        errors.push('instance_name é obrigatório e deve ser uma string válida.')
    }

    if (!data.destination_number || typeof data.destination_number !== 'string' || !data.destination_number.trim()) {
        errors.push('destination_number é obrigatório e deve ser uma string válida.')
    }

    if (!data.message || typeof data.message !== 'string' || !data.message.trim()) {
        errors.push('message é obrigatório e deve ser uma string válida.')
    }

    return errors
}

// Função para validar dados da requisição de estado da instância
function validateInstanceStateRequest(data) {
    const errors = []

    if (!data.instance_name || typeof data.instance_name !== 'string' || !data.instance_name.trim()) {
        errors.push('instance_name é obrigatório e deve ser uma string válida.')
    }

    return errors
}

// GET para criar instância do WhatsApp
router.get('/create_instance', async (req, res) => {
    try {
        // const errors = validateCreateInstanceRequest(req.query)
        // if (errors.length > 0) {
        //     return res.status(400).json({ message: errors.join(' ') })
        // }

        const url = `${API_BASE_URL}/instance/create`
        const payload = {
            instanceName: "molin",
            token: "ABV1-DEF2-M0L1-NB0T",
            qrcode: true,
            integration: "WHATSAPP-BAILEYS",
            rejectCall: true,
            msgCall: "",
            groupsIgnore: true,
            alwaysOnline: false,
            readMessages: false,
            readStatus: false,
            syncFullHistory: true,
            proxyHost: "",
            proxyPort: "",
            proxyProtocol: "",
            proxyUsername: "",
            proxyPassword: "",
            rabbitmq: {
                enabled: false,
                events: ["APPLICATION_STARTUP"]
            },
            sqs: {
                enabled: false,
                events: ["APPLICATION_STARTUP"]
            },
            chatwootAccountId: "",
            chatwootToken: "",
            chatwootUrl: "",
            chatwootSignMsg: true,
            chatwootReopenConversation: true,
            chatwootConversationPending: true,
            chatwootImportContacts: true,
            chatwootNameInbox: "",
            chatwootMergeBrazilContacts: true,
            chatwootImportMessages: true,
            chatwootDaysLimitImportMessages: 123,
            chatwootOrganization: "",
            chatwootLogo: ""
        }

        const response = await axios.post(url, payload, { headers: getHeaders() })
        const responseData = response.data

        console.log(responseData)

        res.json({
            status: 200,
            instance_status: responseData.instance.status,
            qrcode_base64: responseData.qrcode.base64
        })

    } catch (error) {
        console.error('Erro ao criar instância:', error.message)
        res.status(500).json({
            message: 'Erro interno do servidor',
            error: error.response?.data || error.message
        })
    }
})

// GET para enviar mensagem
router.get('/send_message', async (req, res) => {
    try {
        const errors = validateSendMessageRequest(req.query)
        if (errors.length > 0) {
            return res.status(400).json({ message: errors.join(' ') })
        }

        const url = `${API_BASE_URL}/message/sendText/molin`
        const payload = {
            number: req.query.destination_number,
            text: req.query.message,
            delay: 5400
        }

        const response = await axios.post(url, payload, { headers: getHeaders() })
        const responseData = response.data

        console.log(responseData)

        res.json({
            status: 200,
            instance_status: responseData
        })

    } catch (error) {
        console.error('Erro ao enviar mensagem:', error.message)
        res.status(500).json({
            message: 'Erro interno do servidor',
            error: error.response?.data || error.message
        })
    }
})

// GET para verificar estado da instância
router.get('/instance_state', async (req, res) => {
    try {
        const errors = validateInstanceStateRequest(req.query)
        if (errors.length > 0) {
            return res.status(400).json({ message: errors.join(' ') })
        }

        const url = `${API_BASE_URL}/instance/connectionState/${req.query.instance_name}`

        const response = await axios.get(url, { headers: getHeaders() })
        const responseData = response.data

        console.log(responseData)

        res.json({
            status: 200,
            instance_status: responseData
        })

    } catch (error) {
        console.error('Erro ao verificar estado da instância:', error.message)
        res.status(500).json({
            message: 'Erro interno do servidor',
            error: error.response?.data || error.message
        })
    }
})

module.exports = router 