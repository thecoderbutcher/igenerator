const generateForm = document.forms['generate-form']
const imgContainer = document.querySelector('.image-gallery')
const OPENAI_API_KEY = 'sk-dw3iS1FIeV4L0mhNRqyvT3BlbkFJZdTuHEA8DElKnxSB0';
let isLoading = false;
let HGB = '';

const updateImageCard = (imgDataArray) => {
    imgDataArray.forEach((imgObject, index) => {
        const imgCard = imgContainer.querySelectorAll('.img-card')[index];
        const imgElement = imgCard.querySelector('img');
        const downloadBtn = imgCard.querySelector('.download-btn')

        const aiGenerateImg = `data:image/jpeg;base64,${imgObject.b64_json}`;
        imgElement.src = aiGenerateImg;

        imgElement.onload = () => {
            imgCard.classList.remove('loading');
            downloadBtn.setAttribute('href', aiGenerateImg);
            downloadBtn.setAttribute('download', `${new Date().getTime()}.jpg`)
        }
    });
}

const generateImages = async (text, quantity) => {
    try {
        const response = await fetch("https://api.openai.com/v1/images/generations", {
            method:'POST',
            headers:{
                "Content-Type": "application/json",
                Authorization: `Bearer ${OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                prompt: text,
                n: parseInt(quantity),
                size: '512x512',
                response_format: 'b64_json'
            })
        });

        if(!response.ok) throw new Error('Failed to generate images! Please try again.');

        const { data } = await response.json();
        updateImageCard([...data]);
    } catch (error) {
        alert(error.message)
    } finally{
        isLoading = false;
    }
}

generateForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if(isLoading) return;
    isLoading = true;

    textPromp = generateForm['promt-input'].value;
    quantity = generateForm['img-quantity'].value

    const imgCard = Array.from({length: quantity}, () => 
        `<div class="img-card loading">
            <img src="./images/loading.svg" alt="result">
            <a href="" class="download-btn"></a> 
        </div>`
    ).join('');
    imgContainer.innerHTML = imgCard;

    generateImages(textPromp, quantity)
})