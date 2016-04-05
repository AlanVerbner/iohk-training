import faker from 'faker'

function generateRandomItem( index ) {
  return {
    invoiceNumber: index,
    total: parseFloat(faker.finance.amount()),
    createdAt: faker.date.past( 0, new Date() )
  }
}

export default function generateRandomData( count ) {
  return _.times( count, generateRandomItem )
}
