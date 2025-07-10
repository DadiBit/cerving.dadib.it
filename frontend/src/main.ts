import './style.css'

import { inflate } from './inflate';
import { output } from './output';

const bot = document.getElementById('bot');
if (!bot || !(bot instanceof HTMLInputElement)) throw new Error('Bot input element not found');

const form = document.getElementById('form');
if (!form || !(form instanceof HTMLFormElement)) throw new Error('Form element not found');

bot.addEventListener('change', async () => {

  const file = bot.files?.[0];
  if (!file) return;

  // Decompress and import the file
  const module = await inflate(file);
  
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

  submit.addEventListener('click', async () => {
    const entries = new FormData(form).entries();
    const obj = Object.fromEntries(entries) as { [key: string] : string };
    let result = await output(file, obj);
    navigator.clipboard.writeText(result);
  })

  document.body.appendChild(submit);

});