const typeDefs = `#graphql
  type User {
    id: ID!
    name: String!
    email: String!
    phone: String
    role: String!
    status: String!
    createdAt: String!
    updatedAt: String!
    shop: Shop
  }

  type Service {
    id: ID!
    name: String!
    price: Float!
    createdAt: String!
    updatedAt: String!
  }

  type EntryService {
    id: ID!
    service: Service!
    price: Float!
  }

  type Entry {
    id: ID!
    clientNumber: String!
    barberId: String!
    barber: User!
    shop: Shop
    date: String!
    time: String!
    paymentMethod: String!
    totalAmount: Float!
    entryServices: [EntryService!]!
    createdAt: String!
    updatedAt: String!
  }

  type Shop {
    id: ID!
    name: String!
    address: String!
    phone: String
    image: String
    barbers: [User]
    stats: ShopStats
  }

  type ShopStats {
    totalRevenue: Float
    totalEntries: Int
    barberCount: Int
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Stats {
    totalCustomersToday: Int!
    totalRevenueToday: Float!
    cashPayments: Float!
    cardPayments: Float!
    applePayPayments: Float!
    otherPayments: Float!
    totalServicesPerformed: Int!
  }

  type ServiceUsage {
    serviceName: String!
    count: Int!
  }

  type DailyReport {
    totalCustomers: Int!
    totalRevenue: Float!
    cashPayments: Float!
    cardPayments: Float!
    applePayPayments: Float!
    otherPayments: Float!
    serviceUsage: [ServiceUsage!]!
  }

  type WeeklyReport {
    totalRevenue: Float!
    mostUsedService: String
    dailySales: [DailySale!]!
  }

  type DailySale {
    date: String!
    revenue: Float!
  }

  type MonthlyReport {
    totalRevenue: Float!
    topBarber: String
    mostRequestedService: String
    dailySales: [DailySale!]!
  }

  type Query {
    me: User
    users: [User!]!
    user(id: ID!): User
    services: [Service!]!
    service(id: ID!): Service
    entries(barberId: ID, shopId: ID, startDate: String, endDate: String): [Entry!]!
    entry(id: ID!): Entry
    shops: [Shop!]!
    shop(id: ID!): Shop
    stats(startDate: String, endDate: String): Stats!
    dailyReport: DailyReport!
    weeklyReport(startDate: String, endDate: String): WeeklyReport!
    monthlyReport: MonthlyReport!
  }

  type Mutation {
    login(email: String!, password: String!): AuthPayload!
    createUser(name: String!, email: String!, password: String!, phone: String, role: String!, status: String, shopId: ID): User!
    updateUser(id: ID!, name: String, email: String, password: String, phone: String, role: String, status: String, shopId: ID): User!
    deleteUser(id: ID!): Boolean
    createService(name: String!, price: Float!): Service!
    updateService(id: ID!, name: String, price: Float): Service!
    deleteService(id: ID!): Boolean
    createShop(name: String!, address: String!, phone: String, image: String): Shop!
    updateShop(id: ID!, name: String, address: String, phone: String, image: String): Shop!
    deleteShop(id: ID!): Boolean
    createEntry(barberId: ID!, serviceIds: [ID!]!, date: String!, time: String!, paymentMethod: String!): Entry!
  }
`;

export { typeDefs };
