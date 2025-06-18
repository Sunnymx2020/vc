// Generate random peer ID
const peer = new Peer(Math.random().toString(36).substring(2, 8));

let localStream;
let currentCall;

peer.on('open', (id) => {
    console.log('My peer ID is: ' + id);
    document.getElementById('callButton').disabled = false;
});

// Get user media
navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then(stream => {
        localStream = stream;
        document.getElementById('localVideo').srcObject = stream;
    })
    .catch(err => console.error('Error accessing media devices:', err));

// Call another peer
document.getElementById('callButton').addEventListener('click', () => {
    const peerId = document.getElementById('peerIdInput').value;
    const call = peer.call(peerId, localStream);
    setupCallHandlers(call);
});

// Answer incoming calls
peer.on('call', (call) => {
    if (confirm(`Accept call from ${call.peer}?`)) {
        call.answer(localStream);
        setupCallHandlers(call);
    } else {
        call.close();
    }
});

function setupCallHandlers(call) {
    if (currentCall) currentCall.close();
    currentCall = call;
    
    call.on('stream', (remoteStream) => {
        document.getElementById('remoteVideo').srcObject = remoteStream;
    });
    
    call.on('close', () => {
        document.getElementById('remoteVideo').srcObject = null;
    });
}
