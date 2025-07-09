import './style.css'

const bot = document.getElementById('bot');
if (!bot || !(bot instanceof HTMLInputElement)) throw new Error('Bot input element not found');

const form = document.getElementById('form');
if (!form || !(form instanceof HTMLFormElement)) throw new Error('Form element not found');

bot.addEventListener('change', async () => {

  const file = bot.files?.[0];
  if (!file) return;

  const url = URL.createObjectURL(file);
  const module = await import(/* @vite-ignore */ url);
  
  // Delete file input
  bot.remove();

  // Add controls
  let div: HTMLDivElement;
  if ('controls' in module) {
    for (const id in module.controls) {
      const [label, control] = module.controls[id];
      label.htmlFor = control.id;
      control.id = id;
      control.name = id;
      div = document.createElement('div');
      div.appendChild(label);
      div.appendChild(control);
      form.appendChild(div);
    }
  }

  const submit = document.createElement('input');
  submit.value = 'Genera';
  submit.type = 'submit';
  submit.formTarget = form.id;

  submit.addEventListener('click', () => {
    const entries = new FormData(form).entries();
    const obj = Object.fromEntries(entries);
    JSON.stringify(obj);
  })

  document.body.appendChild(submit);

});