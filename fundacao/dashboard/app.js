// MAESTRO AI Engine v3 - Dashboard Application

// Configuration
const API_BASE = window.location.hostname === 'localhost' 
    ? 'http://localhost:8000' 
    : 'http://maestro-brain:8000';

// State
let currentView = 'chat';
let conversationId = null;
let isRecording = false;
let websocket = null;

// Agents data
const agents = [
    { id: 'orchestrator', name: 'Orchestrator', icon: '👔', description: 'Coordenador geral de operações' },
    { id: 'import', name: 'Importação', icon: '🚢', description: 'Fornecedores China/Itália' },
    { id: 'advertising', name: 'Publicidade', icon: '📢', description: 'Meta, Google, TikTok Ads' },
    { id: 'luxury_watch', name: 'Relógios', icon: '⌚', description: 'Análise técnica de luxo' },
    { id: 'whatsapp_sdr', name: 'WhatsApp SDR', icon: '💬', description: 'Vendas via WhatsApp' },
    { id: 'tiktok_growth', name: 'TikTok', icon: '🎵', description: 'Crescimento orgânico' },
    { id: 'knowledge_sync', name: 'Knowledge Sync', icon: '🧠', description: 'Sincronização de dados' },
];

// Containers data (simulated - in production would fetch from Docker API)
const containers = [
    { name: 'maestro-brain', port: 8000, status: 'running', cpu: '2%', memory: '256MB' },
    { name: 'maestro-crewai', port: 8002, status: 'running', cpu: '5%', memory: '512MB' },
    { name: 'maestro-dashboard', port: 3333, status: 'running', cpu: '1%', memory: '64MB' },
    { name: 'maestro-api', port: 8001, status: 'running', cpu: '3%', memory: '128MB' },
    { name: 'maestro-litellm', port: 4000, status: 'running', cpu: '10%', memory: '1GB' },
    { name: 'maestro-n8n', port: 5678, status: 'running', cpu: '4%', memory: '384MB' },
    { name: 'maestro-evolution', port: 8080, status: 'running', cpu: '2%', memory: '256MB' },
    { name: 'maestro-qdrant', port: 6333, status: 'running', cpu: '8%', memory: '512MB' },
    { name: 'maestro-postgres', port: 5432, status: 'running', cpu: '5%', memory: '256MB' },
    { name: 'maestro-redis', port: 6379, status: 'running', cpu: '1%', memory: '32MB' },
    { name: 'maestro-grafana', port: 3000, status: 'running', cpu: '2%', memory: '128MB' },
    { name: 'maestro-prometheus', port: 9090, status: 'running', cpu: '3%', memory: '256MB' },
];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initChat();
    initVoice();
    loadAgents();
    loadMetrics();
    loadContainers();
    initWebSocket();
});

// Navigation
function initNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const view = btn.dataset.view;
            switchView(view);
            
            navButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
}

function switchView(viewName) {
    const views = document.querySelectorAll('.view');
    views.forEach(view => view.classList.remove('active'));
    
    const targetView = document.getElementById(`${viewName}-view`);
    if (targetView) {
        targetView.classList.add('active');
    }
    
    currentView = viewName;
}

// Chat
function initChat() {
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    sendBtn.addEventListener('click', sendMessage);
}

async function sendMessage() {
    const chatInput = document.getElementById('chat-input');
    const message = chatInput.value.trim();
    
    if (!message) return;
    
    // Add user message
    addMessage(message, 'user');
    chatInput.value = '';
    
    // Show typing indicator
    addTypingIndicator();
    
    try {
        const response = await fetch(`${API_BASE}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: message,
                conversation_id: conversationId
            })
        });
        
        const data = await response.json();
        
        // Remove typing indicator
        removeTypingIndicator();
        
        // Add bot response
        addMessage(data.message, 'bot');
        
        // Update conversation ID
        if (!conversationId) {
            conversationId = data.conversation_id;
        }
    } catch (error) {
        removeTypingIndicator();
        addMessage('Erro ao conectar com o servidor. Tente novamente.', 'bot');
        console.error('Chat error:', error);
    }
}

function addMessage(content, sender) {
    const messagesContainer = document.getElementById('chat-messages');
    const time = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    messageDiv.innerHTML = `
        <div class="message-content">
            <p>${content}</p>
        </div>
        <span class="message-time">${time}</span>
    `;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function addTypingIndicator() {
    const messagesContainer = document.getElementById('chat-messages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot typing';
    typingDiv.id = 'typing-indicator';
    typingDiv.innerHTML = `
        <div class="message-content">
            <p>Digitando<span class="dots">...</span></p>
        </div>
    `;
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function removeTypingIndicator() {
    const typing = document.getElementById('typing-indicator');
    if (typing) typing.remove();
}

// Voice
function initVoice() {
    const voiceBtn = document.getElementById('voice-btn');
    
    voiceBtn.addEventListener('mousedown', startRecording);
    voiceBtn.addEventListener('mouseup', stopRecording);
    voiceBtn.addEventListener('mouseleave', stopRecording);
    
    // Touch support
    voiceBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        startRecording();
    });
    voiceBtn.addEventListener('touchend', stopRecording);
}

function startRecording() {
    isRecording = true;
    const voiceBtn = document.getElementById('voice-btn');
    const voiceStatus = document.getElementById('voice-status');
    
    voiceBtn.classList.add('recording');
    voiceStatus.textContent = 'Gravando...';
    
    // In production, would use Web Audio API / MediaRecorder
    console.log('Recording started');
}

function stopRecording() {
    if (!isRecording) return;
    
    isRecording = false;
    const voiceBtn = document.getElementById('voice-btn');
    const voiceStatus = document.getElementById('voice-status');
    
    voiceBtn.classList.remove('recording');
    voiceStatus.textContent = 'Processando...';
    
    // Simulate transcription
    setTimeout(() => {
        voiceStatus.textContent = 'Aguardando...';
        document.getElementById('voice-transcript').innerHTML = 
            '<p>Mensagem de voz processada com sucesso!</p>';
    }, 1500);
}

// Agents
function loadAgents() {
    const grid = document.getElementById('agents-grid');
    
    agents.forEach(agent => {
        const card = document.createElement('div');
        card.className = 'agent-card';
        card.innerHTML = `
            <div class="agent-card-header">
                <span class="agent-icon">${agent.icon}</span>
                <span class="agent-name">${agent.name}</span>
                <span class="agent-status">✓</span>
            </div>
            <p class="agent-description">${agent.description}</p>
            <div class="agent-actions">
                <button class="agent-btn" onclick="executeAgent('${agent.id}')">Executar</button>
                <button class="agent-btn" onclick="viewAgentLogs('${agent.id}')">Logs</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

async function executeAgent(agentId) {
    const task = prompt('Digite a tarefa para o agente:');
    if (!task) return;
    
    try {
        const response = await fetch(`${API_BASE}/api/agents/execute`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                task: task,
                agent: agentId
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            addMessage(`✅ Agente ${agentId}: ${data.result}`, 'bot');
        } else {
            addMessage(`❌ Erro: ${data.error}`, 'bot');
        }
    } catch (error) {
        addMessage('❌ Erro ao executar agente', 'bot');
    }
}

function viewAgentLogs(agentId) {
    addMessage(`📋 Logs do agente ${agentId} solicitados`, 'bot');
}

// Metrics
async function loadMetrics() {
    try {
        const response = await fetch(`${API_BASE}/api/metrics`);
        const data = await response.json();
        
        document.getElementById('metric-conversations').textContent = data.conversations || 0;
        document.getElementById('metric-messages').textContent = data.messages || 0;
        
        // Load activity
        const activityList = document.getElementById('activity-list');
        if (data.recent_executions && data.recent_executions.length > 0) {
            activityList.innerHTML = data.recent_executions.map(exec => `
                <div class="activity-item">
                    <span class="activity-icon">🤖</span>
                    <span class="activity-text">${exec.agent}: ${exec.task}</span>
                    <span class="activity-time">${new Date(exec.created_at).toLocaleTimeString()}</span>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Metrics error:', error);
    }
}

// Containers
function loadContainers() {
    const grid = document.getElementById('containers-grid');
    
    containers.forEach(container => {
        const card = document.createElement('div');
        card.className = 'container-card';
        card.innerHTML = `
            <div class="container-header">
                <span class="container-name">${container.name}</span>
                <span class="container-status ${container.status}"></span>
            </div>
            <div class="container-port">Porta: ${container.port}</div>
            <div class="container-stats">
                <span>CPU: ${container.cpu}</span>
                <span>Mem: ${container.memory}</span>
            </div>
        `;
        grid.appendChild(card);
    });
}

// WebSocket
function initWebSocket() {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.hostname}:8000/ws/user_${Date.now()}`;
    
    try {
        websocket = new WebSocket(wsUrl);
        
        websocket.onopen = () => {
            console.log('WebSocket connected');
        };
        
        websocket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            handleWebSocketMessage(data);
        };
        
        websocket.onerror = (error) => {
            console.log('WebSocket error (normal if not in container)');
        };
        
        websocket.onclose = () => {
            console.log('WebSocket disconnected');
        };
    } catch (error) {
        console.log('WebSocket not available');
    }
}

function handleWebSocketMessage(data) {
    if (data.type === 'chat_response') {
        addMessage(data.content, 'bot');
    } else if (data.type === 'notification') {
        addMessage(`🔔 ${data.content}`, 'bot');
    }
}

// Auto-refresh metrics every 30 seconds
setInterval(loadMetrics, 30000);
