import React, { Component } from "react";
import axios from "axios";
import "./App.css";

axios.interceptors.response.use(null, (error) => {
  const expectedError =
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 500;
  if (!expectedError) {
    console.log("Logging the error", error);
    alert("An unexpected error occured");
  }

  return Promise.reject(error);
});

const apiEndpoint = "https://jsonplaceholder.typicode.com/posts"; //fake backend
class App extends Component {
  state = {
    posts: [],
  };

  async componentDidMount() {
    // 用于装载异步操作对象，即将要完成的操作
    // pending > resolved (success) OR rejected (failure)
    const { data: posts } = await axios.get(apiEndpoint);
    this.setState({ posts });
  }

  // 先请求服务器，再进行前端修改，为保守(Pessimistic)操作
  handleAdd = async () => {
    const obj = { title: "a", body: "b" };
    const { data: post } = await axios.post(apiEndpoint, obj);

    const posts = [post, ...this.state.posts];
    this.setState({ posts });
  };

  handleUpdate = async (post) => {
    post.title = "UPDATE";
    await axios.put(apiEndpoint + "/" + post.id, post);

    const posts = [...this.state.posts];
    const index = posts.indexOf(post);
    posts[index] = { ...post };
    this.setState({ posts });
  };

  handleDelete = async (post) => {
    const originalPost = this.state.posts;

    const posts = this.state.posts.filter((p) => p.id !== post.id);
    this.setState({ posts });

    try {
      await axios.delete("s" + apiEndpoint + "/" + post.id);
    } catch (ex) {
      // Expected
      if (ex.response && ex.response.status === 404)
        alert("This post has already been deleted.");
      this.setState({ posts: originalPost });
    }
  };
  render() {
    return (
      <React.Fragment>
        <button className="btn btn-primary" onClick={this.handleAdd}>
          Add
        </button>
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Update</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {this.state.posts.map((post) => (
              <tr key={post.id}>
                <td>{post.title}</td>
                <td>
                  <button
                    className="btn btn-info btn-sm"
                    onClick={() => this.handleUpdate(post)}
                  >
                    Update
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => this.handleDelete(post)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </React.Fragment>
    );
  }
}

export default App;
