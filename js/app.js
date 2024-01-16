const generateForm = document.forms['generate-form']
const imgContainer = document.querySelector('.image-gallery')
const OPENAI_API_KEY = '';

const generateImages = async (text, quantity) => {
    try {
        const response = await fetch('https://api.openai.com/v1/images/generations', {
            method:'POST',
            headers:{
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                prompt: text,
                n: quantity,
                size: '512x512',
                response_format: 'b64_json'
            })
        })
    } catch (error) {
        console.log(error)
    }
}

generateForm.addEventListener('submit', (e) => {
    e.preventDefault();
    textPromp = generateForm['promt-input'].value;
    quantity = generateForm['img-quantity'].value

    const imgCard = Array.from({length: quantity}, () => 
        `<div class="img-card loading">
            <img src="/images/loading.svg" alt="result">
            <a href="" class="download-btn"></a> 
        </div>`
    ).join('');
    imgContainer.innerHTML = imgCard;

    generateImages(textPromp, quantity)
})