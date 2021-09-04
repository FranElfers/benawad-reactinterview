import React from 'react';
import './App.css';

// Get data and format it to my needs
const fetchData = () => fetch('https://randomuser.me/api/?results=20')
  .then(res => res.json())
  .then(res => res.results.map(({ location, name }) => (
    {
      city: location.city,
      state: location.state,
      country: location.country,
      postcode: location.postcode,
      number: location.street.number,
      name: `${name.first} ${name.last}`, 
      latitude: location.coordinates.latitude,
      longitude: location.coordinates.longitude
    }
  )))

// Component: Table row by iterating the attributes
const Person = ({ data }) => <tr>
  {Object.values(data).map(prop => <td key={prop}>{prop}</td>)}
</tr>

function App() {
  const [ headerSorter, setHeaderSorter ] = React.useState({ header:'', direction: true })
  const [ localPeople, setLocalPeople ] = React.useState([])
  const [ apiPeople, setApiPeople ] = React.useState([])
  const headers = ['city', 'state', 'country', 'postcode', 'number', 'name', 'latitude', 'longitude']
  

  // Sort all rows of people by the attribute clicked
  // Number, latitude & longitude attributes are 'number' sorted, others are 'string' sorted
  // direction true as ascending and direction false as descending
  const sorter = attr => {
    setHeaderSorter({
      header: attr,
      direction: headerSorter.header === attr ? !headerSorter.direction : true
    })

    const direction = headerSorter.header === attr ? !headerSorter.direction : true
    
    const sortNumber = (a,b) => direction ? a[attr] - b[attr] : b[attr] - a[attr]
    const sortText = (a,b) => direction 
      ? (a[attr]+'').localeCompare(b[attr]) 
      : (b[attr]+'').localeCompare(a[attr])
      
    setLocalPeople([...apiPeople].sort(
      ['number','latitude','longitude'].includes(attr) ? sortNumber : sortText
    ))
  }

  // Searcher that filters the list of people by comparing every attribute with the input keyword
  const searcher = event => {
    if (!apiPeople.length) return

    const filteredPeople = apiPeople.filter(person => 
      Object.values(person).some(value => 
        (value+'').toLowerCase().includes(event.target.value.toLowerCase())
      )
    )

    setLocalPeople(filteredPeople)
  }

  React.useEffect(() => {
    fetchData()
    .then(res => {
      setApiPeople(res)
      setLocalPeople(res)
    })
  },[])

  return <div className="App">
    <input onChange={searcher} placeholder="Search" />
    <table style={{width: '100%'}}>
      <thead>
        <tr>{headers.map(text => 
          <th key={text} onClick={() => sorter(text)}>{text}</th>
        )}</tr>
      </thead>
      <tbody>
        {localPeople.map(data => <Person key={data.postcode} data={data} />)}
      </tbody>
    </table>
    <p>Why isn't the Post-Code column always correctly sorted? As post-code is an alphanumeric value, it's sorted as a string every time regardless of lack of letters.</p>
  </div>
}

export default App;