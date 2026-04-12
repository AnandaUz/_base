//tsx .tools/deploy_prodaction.ts

const VERSEL_DEP_LINK = ''



const HOOK_URL = VERSEL_DEP_LINK;


async function deploy() {
  const response = await fetch(HOOK_URL, { method: 'POST' });
  const data = await response.json();
  console.log('Deploy triggered:', data);
}

deploy();