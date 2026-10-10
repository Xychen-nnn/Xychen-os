const form=document.querySelector('form[data-community]');
if(form){
  const status=document.createElement('p');
  status.id='community-status';
  status.setAttribute('role','status');
  form.appendChild(status);
  form.addEventListener('submit',async event=>{
    event.preventDefault();
    const button=form.querySelector('button[type="submit"],button:not([type])');
    if(button)button.disabled=true;
    status.textContent='Sending…';
    try{
      const body=Object.fromEntries(new FormData(form));
      const response=await fetch('/api/'+form.dataset.community,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
      const data=await response.json().catch(()=>({}));
      if(!response.ok)throw new Error(data.error||'Unable to submit right now.');
      form.reset();
      status.textContent='Submitted successfully. No account was needed.';
    }catch(error){
      status.textContent=error.message||'Unable to submit right now.';
    }finally{
      if(button)button.disabled=false;
    }
  });
}
