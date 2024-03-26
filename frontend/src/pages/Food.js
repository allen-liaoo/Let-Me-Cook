export const route = {
    path: "/food/:id",
    element: <Food/>
}

function Food() {
    return (
      <p>Food page to view food info (require sign in)</p>
    );
  }

export default Food;