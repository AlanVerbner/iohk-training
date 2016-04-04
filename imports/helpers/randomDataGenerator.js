import faker from 'faker'

function generateRandomItem( index ) {
  return {
    invoiceNumber: index,
    total: faker.finance.amount(),
    createdAt: faker.date.past( 0, new Date( new Date() - 7 ) )
  }
}

export default function generateRandomData( count ) {
  return _.times( count, generateRandomItem )
}
