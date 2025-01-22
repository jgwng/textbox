<script>
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        console.log("Message received in side panel:", message);
         document.getElementById("output").innerText = message.content;
        sendResponse({ status: "Message received in side panel!" });
    });
</script>

<div>
    <div style="height:40px;"></div>
    <h1>텍스트 박스 사이드 판넬 입니다!</h1>
    <script src="index.js" type="module"></script>
</div>