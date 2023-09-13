import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { List } from '@/components/List/'

describe('Test List component', () => {
  it('Component has a header and a description', () => {
    const mockData = [
      { header: 'Random header', description: 'Random description' },
    ]

    render(<List data={mockData} />)
    const elementByHeader = screen.getByText('Random header')
    expect(elementByHeader).toBeDefined()
    const elementBydescription = screen.getByText('Random description')
    expect(elementBydescription).toBeDefined()
  })
})
