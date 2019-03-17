import React, { Component } from 'react';
import "./App.css"

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {gender: 'Male',first:'',last:'',father:'',age:0,addr:'',loading: true, drizzleState: null,stackId:null};
    this.handleChange = this.handleChange.bind(this);
    this.formGenerator = this.formGenerator.bind(this);
    this.genderGenerator=this.genderGenerator.bind(this);
    this.form=this.form.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setValue= this.setValue.bind(this);
  }

  componentDidMount() {
    const { drizzle } = this.props;
    // subscribe to changes in the store
    this.unsubscribe = drizzle.store.subscribe(() => {
      // every time the store updates, grab the state from drizzle
      const drizzleState = drizzle.store.getState();
      // check to see if it's ready, if so, update local component state
      console.log(drizzleState);
      if (drizzleState.drizzleStatus.initialized) {
        this.setState({ loading: false, drizzleState });
      }
    });
  }

  compomentWillUnmount() {
    this.unsubscribe();
  }


  render() {
    if (this.state.loading) return "Loading Citizenship...";
    return (
      <div className="App">
        {this.form()}

      </div>
    );
  }
  setValue(){
    const { drizzle } = this.props;
    const contract = drizzle.contracts.Citizenship;
    const drizzleState = this.state.drizzleState;
    console.log(drizzleState)
    const stackId = contract.methods["addCitizen"].cacheSend(this.state.first,this.state.last,this.state.father,this.state.age,this.state.gender,this.state.addr, {
      from: drizzleState.accounts[0]
    });
    this.setState({ stackId });
  }
  
  handleSubmit(event){
    event.preventDefault();
    this.setValue();

  }
  form(){
      return(
      <div>
      <h1 className="header">Register a Citizen</h1>
      <form className="form-horizontal" onSubmit={this.handleSubmit}>
        <fieldset>
        {this.formGenerator("firstName","first","First Name",this.state.first,"text")}
        {this.formGenerator("lastName","last","Last Name",this.state.last,"text")}
        {this.formGenerator("father","father","Fathers Name",this.state.father,"text")}
        {this.formGenerator("Age","age","Age",this.state.age,"number")}
        {this.genderGenerator()}
        {this.formGenerator("Address","addr","Address",this.state.addr,"text")}
        </fieldset>
        <input type="submit" value="Submit"  />
      </form>     
      
      </div>);
  }

  formGenerator(_id,name,placeholder,value,type){
    return(<div className="form-group">
    <div className= "col-md-16 inputGroupContainer">
      <div className="input-group"><input id={_id} name={name} placeholder={placeholder} className="form-control" required={true} value={value} onChange={this.handleChange} type={type} ></input>
      </div>
    </div>
  </div>)
  }
  
  genderGenerator(){
    return(
      <div className ="Gender">
      <label> Gender:
      <select value={this.state.gender} onChange={this.handleChange} name="gender">
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
      </select>
      </label>
    </div>
    )
  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    
    this.setState({
      [name]: value
    });
  
  }

}

export default App;
