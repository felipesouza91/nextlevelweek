import Knex from 'knex';

export async function seed(knex: Knex) {
  await knex('items').insert([
    { title: 'Lampada', image: 'lampadas.svg' },
    { title: 'Pilhas e baterias', image: 'baterias.svg' },
    { title: 'Papéis e Papelão', image: 'papeis-papelao.svg' },
    { title: 'Resíduos Eletrônicos', image: 'eletronicos.svg' },
    { title: 'Resíduos Organicos', image: 'organicos.svg' },
    { title: 'Óleio de cozinha', image: 'oleo.svg' },
  ]);
}
