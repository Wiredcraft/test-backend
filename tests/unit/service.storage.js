
const { expect } = require('chai')
let { fetch, insert, update, deleteOne, disconnect, connect } = require('../../src/services/storage/handler')

beforeEach(async () => {
  try {
    await connect()
  } catch (e) {
    console.log(e)
    process.exit(1)
  }
})

afterEach(async () => {
  await disconnect()
})

describe('Storage service unit tests', async () => {
  it('insertion, fetching , deletion', async () => {
    const insertResult = await insert('testDocuments', { test: 1 })
    expect(insertResult.test).to.be.equal(1)

    const fetchResult = await fetch('testDocuments', insertResult._id)
    expect(fetchResult.test).to.be.equal(1)

    const deleteResult = await deleteOne('testDocuments', fetchResult._id)
    expect(deleteResult.test).to.be.equal(1)
  })

  it('document modification', async () => {
    const insertResult = await insert('testDocuments', { test: 1 })
    expect(insertResult.test).to.be.equal(1)

    const updateResult = await update('testDocuments', insertResult._id, { newKey: 'boom' })
    expect(updateResult.newKey).to.be.equal('boom')

    const deleteResult = await deleteOne('testDocuments', updateResult._id)
    expect(deleteResult.newKey).to.be.equal('boom')
  })
})
