import React, { Component } from 'react';

class componentName extends Component {
  render() {
    return (
      <>
      <Table striped bordered hover>
        <thead>
            <tr>
            <th>#</th>
            <th>Hotel Name</th>
            <th>Location</th>
            </tr>
        </thead>
        <tbody>
            <tr>
            <td>1</td>   
            <td>Sandariya</td>
            <td>Jabalpur</td>
            </tr>
            <tr>
            <td>2</td>
            <td>Oyo</td>
            <td>Indore</td>
            </tr>
            <tr>
            <td>3</td>
            <td colSpan="2">Larry the Bird</td>
            <td>@twitter</td>
            </tr>
        </tbody>
        </Table>
      </>
    );
  }
}

export default componentName;
