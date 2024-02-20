async function findPerson() {
    gebi('target').scrollIntoView({
        block: 'center'
      });
    gebi('search').value='';
    await delay(1000);
    gebi('target').classList.add('yellowBg');
}

function reset() {
    gebi('search').value='';
    gebi('target').classList.remove('yellowBg');
}