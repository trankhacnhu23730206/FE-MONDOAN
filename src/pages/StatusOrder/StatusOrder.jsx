import "./StatusOrder.css";

const orders = [
  {
    id: "#2359",
    productName: "Razer Viper V3 Pro Counter-Strike 2 Edition Mouse",
    quantity: 1,
    status: "completed",
    total: 4990000,
    dateAdded: "2026-04-15",
    thumbnail: "",
  },
  {
    id: "#2360",
    productName: "Razer Viper V3 Pro Counter-Strike 2 Edition Mouse",
    quantity: 1,
    status: "pending",
    total: 4990000,
    dateAdded: "2026-04-15",
    thumbnail: "",
  },
  {
    id: "#2361",
    productName: "Razer Viper V3 Pro Counter-Strike 2 Edition Mouse",
    quantity: 1,
    status: "completed",
    total: 4990000,
    dateAdded: "2026-04-15",
    thumbnail: "",
  },
  {
    id: "#2362",
    productName: "Razer Viper V3 Pro Counter-Strike 2 Edition Mouse",
    quantity: 1,
    status: "pending",
    total: 4990000,
    dateAdded: "2026-04-16",
    thumbnail: "",
  },
  {
    id: "#2363",
    productName: "Razer Viper V3 Pro Counter-Strike 2 Edition Mouse",
    quantity: 1,
    status: "completed",
    total: 4990000,
    dateAdded: "2026-04-15",
    thumbnail: "",
  },
];

const sidebarItems = [
  "Account Details",
  "My Orders",
  "Favorite Item",
  "Payment Methods",
];

const formatCurrency = (value) => {
  return `${new Intl.NumberFormat("vi-VN").format(value)}đ`;
};

const formatDate = (value) => {
  return new Date(value).toLocaleDateString("vi-VN");
};

const getInitials = (name = "") => {
  return name
    .trim()
    .split(" ")
    .slice(-2)
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase();
};

function StatusOrder() {
  const user = {
    name: "Phan Nhật Hòa",
    email: "phannhatho13@gmail.com",
  };

  return (
    <section className="order-status-page">
      <div className="order-status-container">
        <h1 className="order-status-title">My Orders</h1>

        <div className="order-status-layout">
          <aside className="order-sidebar">
            <div className="order-user-card">
              <div className="order-user-top">
                <div className="order-avatar">{getInitials(user.name)}</div>

                <div className="order-user-info">
                  <h3>{user.name}</h3>
                  <p>{user.email}</p>
                </div>
              </div>

              <div className="order-sidebar-menu">
                {sidebarItems.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={`sidebar-menu-item ${
                      item === "My Orders" ? "active" : ""
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>

              <button type="button" className="signout-btn">
                Sign Out
              </button>
            </div>
          </aside>

          <div className="order-history-card">
            <div className="order-history-header">
              <h2>Order History</h2>
            </div>

            <div className="order-table">
              <div className="order-table-head order-grid">
                <div>Order ID</div>
                <div>Product Info</div>
                <div>Status</div>
                <div>Total</div>
                <div>Date Added</div>
                <div></div>
              </div>

              <div className="order-table-body">
                {orders.map((order) => (
                  <article key={order.id} className="order-row order-grid">
                    <div className="order-cell order-id" data-label="Order ID">
                      {order.id}
                    </div>

                    <div
                      className="order-cell order-product"
                      data-label="Product Info"
                    >
                      <div className="order-thumb">
                        {order.thumbnail ? (
                          <img src={order.thumbnail} alt={order.productName} />
                        ) : (
                          <span>IMG</span>
                        )}
                      </div>

                      <div className="order-product-info">
                        <h3>{order.productName}</h3>
                        <p>Qty: {order.quantity}</p>
                      </div>
                    </div>

                    <div
                      className={`order-cell order-status-badge ${order.status}`}
                      data-label="Status"
                    >
                      {order.status === "completed" ? "Completed" : "Pending"}
                    </div>

                    <div
                      className="order-cell order-total"
                      data-label="Total"
                    >
                      {formatCurrency(order.total)}
                    </div>

                    <div className="order-cell order-date" data-label="Date Added">
                      {formatDate(order.dateAdded)}
                    </div>

                    <div className="order-cell order-actions" data-label="Action">
                      {order.status === "completed" && (
                        <button type="button" className="action-btn buy-again-btn">
                          Buy Again
                        </button>
                      )}

                      <button type="button" className="action-btn contact-btn">
                        Contact
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default StatusOrder;