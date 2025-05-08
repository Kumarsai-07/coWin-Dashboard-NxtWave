import {Component} from 'react'
import Loader from 'react-loader-spinner'

import VaccinationCoverage from '../VaccinationCoverage'
import VaccinationByGender from '../VaccinationByGender'
import VaccinationByAge from '../VaccinationByAge'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class CowinDashboard extends Component {
  state = {
    vaccinationByDays: [],
    vaccinationByAge: [],
    vaccinationByGender: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getVaccinationData()
  }

  getVaccinationData = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    const vaccinationDataApiUrl = 'https://apis.ccbp.in/covid-vaccination-data'

    const response = await fetch(vaccinationDataApiUrl)
    console.log(response.status)
    if (response.ok) {
      const data = await response.json()

      const formattedDataByDays = data.last_7_days_vaccination.map(eachDay => ({
        dose1: eachDay.dose_1,
        dose2: eachDay.dose_2,
        vaccineDate: eachDay.vaccine_date,
      }))

      const formattedDataByAge = data.vaccination_by_age.map(eachAge => ({
        age: eachAge.age,
        count: eachAge.count,
      }))

      const formattedDataByGender = data.vaccination_by_gender.map(
        eachGender => ({
          count: eachGender.count,
          gender: eachGender.gender,
        }),
      )

      this.setState({
        vaccinationByDays: formattedDataByDays,
        vaccinationByAge: formattedDataByAge,
        vaccinationByGender: formattedDataByGender,
        apiStatus: apiStatusConstants.success,
      })
    } else if (response.status === 401) {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderVaccinationDashboard = () => {
    const {
      vaccinationByDays,
      vaccinationByAge,
      vaccinationByGender,
    } = this.state
    return (
      <>
        <VaccinationCoverage vaccinationCoverageDetails={vaccinationByDays} />
        <VaccinationByGender genderDetails={vaccinationByGender} />
        <VaccinationByAge ageDetails={vaccinationByAge} />
      </>
    )
  }

  renderFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
        className="failure-img"
      />
      <h1 className="failure-heading"> Something went wrong </h1>
    </div>
  )

  renderLoaderView = () => (
    <div data-testid="loader" className="loader-container">
      <Loader type="ThreeDots" color="#ffffff" height={80} width={80} />
    </div>
  )

  renderApiConstants = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderVaccinationDashboard()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoaderView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="dashboard-bg-container">
        <div className="logo-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
            alt="website logo"
            className="website-logo"
          />
          <h1 className="logo-text"> co-WIN </h1>
        </div>
        <h1 className="heading"> CoWIN Vaccination in India </h1>
        {this.renderApiConstants()}
      </div>
    )
  }
}

export default CowinDashboard
