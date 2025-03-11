let o=null;self.onmessage=n=>{const{type:e,payload:s}=n.data;switch(console.log("TranscriptionWorker received message:",e),e){case"CONNECT":if(!s.transcriptionWsEndpoint){console.error("Missing transcriptionWsEndpoint configuration."),postMessage({type:"ERROR",payload:"Missing transcriptionWsEndpoint configuration"});return}t(s.transcriptionWsEndpoint);break;case"DISCONNECT":console.log("DISCONNECT message received."),a();break;case"SEND_AUDIO":console.log("SEND_AUDIO message received."),r(s.wavData);break;default:console.warn("Unknown message type from main thread:",e)}};const t=n=>{if(console.log("Connecting to WebSocket endpoint:",n),o&&o.readyState===WebSocket.OPEN){console.log("WebSocket is already connected."),postMessage({type:"CONNECTED"});return}try{o=new WebSocket(n),o.binaryType="arraybuffer",o.onopen=()=>{console.log("WebSocket connection established in worker."),postMessage({type:"CONNECTED"})},o.onmessage=e=>{try{if(typeof e.data=="string"){const s=JSON.parse(e.data);console.log("WebSocket message received in worker:",s),postMessage({type:"MESSAGE",payload:s})}}catch(s){console.error("Worker error parsing WebSocket message:",s),postMessage({type:"ERROR",payload:"Error parsing WebSocket message"})}},o.onclose=e=>{console.log("WebSocket connection closed in worker:",e.code,e.reason),postMessage({type:"DISCONNECTED",payload:{code:e.code,reason:e.reason}})},o.onerror=e=>{console.error("WebSocket error in worker:",e),postMessage({type:"ERROR",payload:"WebSocket connection error"})}}catch(e){console.error("Error establishing WebSocket connection:",e),postMessage({type:"ERROR",payload:"Failed to establish WebSocket connection"})}},a=()=>{console.log("Disconnecting WebSocket."),o?(o.close(),o=null,postMessage({type:"DISCONNECTED"}),console.log("WebSocket disconnected.")):console.warn("WebSocket is already null.")},r=n=>{if(console.log("Sending audio data to WebSocket."),!o||o.readyState!==WebSocket.OPEN){console.error("WebSocket is not connected. Cannot send audio data."),postMessage({type:"ERROR",payload:"WebSocket is not connected. Cannot send audio data."});return}try{o.send(n),console.log("Audio data sent to WebSocket.")}catch(e){console.error("Error sending audio data:",e),postMessage({type:"ERROR",payload:"Failed to send audio data"})}};
