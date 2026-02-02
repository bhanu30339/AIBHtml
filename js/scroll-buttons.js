document.addEventListener('DOMContentLoaded',function(){const scrollButtonsHTML=`
        <div id="scrollButtons" style="position: fixed; right: 24px; bottom: 32px; display: flex; flex-direction: column; gap: 12px; z-index: 1000;">
            <button id="scrollTopBtn" 
                    style="width: 48px; height: 48px; background-color: #0C2340; color: white; border-radius: 50%; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.15); transition: all 0.3s ease; font-size: 18px; visibility: hidden; opacity: 0;"
                    title="Scroll to top"
                    aria-label="Scroll to top">
                <i class="fas fa-chevron-up"></i>
            </button>
            <button id="scrollBottomBtn" 
                    style="width: 48px; height: 48px; background-color: #F5C642; color: #0C2340; border-radius: 50%; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.15); transition: all 0.3s ease; font-size: 18px; visibility: hidden; opacity: 0;"
                    title="Scroll to bottom"
                    aria-label="Scroll to bottom">
                <i class="fas fa-chevron-down"></i>
            </button>
        </div>
    `;document.body.insertAdjacentHTML('beforeend',scrollButtonsHTML);const scrollTopBtn=document.getElementById('scrollTopBtn');const scrollBottomBtn=document.getElementById('scrollBottomBtn');function updateButtonVisibility(){const scrollHeight=document.documentElement.scrollHeight;const scrollTop=window.scrollY;const windowHeight=window.innerHeight;if(scrollTop>=100){scrollTopBtn.style.visibility='visible';scrollTopBtn.style.opacity='1'}else{scrollTopBtn.style.visibility='hidden';scrollTopBtn.style.opacity='0'}
const isAtBottom=scrollTop+windowHeight>=scrollHeight-100;if(!isAtBottom){scrollBottomBtn.style.visibility='visible';scrollBottomBtn.style.opacity='1'}else{scrollBottomBtn.style.visibility='hidden';scrollBottomBtn.style.opacity='0'}}
scrollTopBtn.addEventListener('mouseenter',function(){this.style.backgroundColor='#1a3550';this.style.transform='scale(1.1)';this.style.boxShadow='0 8px 20px rgba(0,0,0,0.25)'});scrollTopBtn.addEventListener('mouseleave',function(){this.style.backgroundColor='#0C2340';this.style.transform='scale(1)';this.style.boxShadow='0 4px 12px rgba(0,0,0,0.15)'});scrollBottomBtn.addEventListener('mouseenter',function(){this.style.backgroundColor='#e6b300';this.style.transform='scale(1.1)';this.style.boxShadow='0 8px 20px rgba(0,0,0,0.25)'});scrollBottomBtn.addEventListener('mouseleave',function(){this.style.backgroundColor='#F5C642';this.style.transform='scale(1)';this.style.boxShadow='0 4px 12px rgba(0,0,0,0.15)'});scrollTopBtn.addEventListener('click',function(){window.scrollTo({top:0,behavior:'smooth'})});scrollBottomBtn.addEventListener('click',function(){window.scrollTo({top:document.documentElement.scrollHeight,behavior:'smooth'})});window.addEventListener('scroll',updateButtonVisibility);window.addEventListener('resize',updateButtonVisibility);updateButtonVisibility()})