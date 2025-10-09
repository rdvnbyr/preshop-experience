// Shopware API Types
export interface ShopwareProduct {
  id: string;
  versionId?: string;
  parentId?: string;
  parentVersionId?: string;
  manufacturerId?: string;
  productManufacturerVersionId?: string;
  unitId?: string;
  taxId: string;
  coverId?: string;
  productMediaVersionId?: string;
  deliveryTimeId?: string;
  canonicalProductId?: string;
  canonicalProductVersionId?: string;
  cmsPageId?: string;
  cmsPageVersionId?: string;
  productNumber: string;
  restockTime?: number;
  active?: boolean;
  available: boolean;
  isCloseout: boolean;
  availableStock: number;
  stock: number;
  displayGroup?: string;
  manufacturerNumber?: string;
  ean?: string;
  purchaseSteps: number;
  maxPurchase?: number;
  minPurchase: number;
  purchaseUnit?: number;
  referenceUnit?: number;
  shippingFree: boolean;
  markAsTopseller?: boolean;
  weight?: number;
  width?: number;
  height?: number;
  length?: number;
  releaseDate?: string;
  ratingAverage?: number;
  categoryTree?: string[];
  propertyIds?: string[];
  optionIds?: string[];
  streamIds?: string[];
  tagIds?: string[];
  categoryIds?: string[];
  childCount?: number;
  sales?: number;
  states?: string[];
  metaDescription?: string;
  name: string;
  keywords?: string;
  description?: string;
  metaTitle?: string;
  packUnit?: string;
  packUnitPlural?: string;
  customFields?: Record<string, unknown>;
  price?: ShopwareCalculatedPrice[];
  calculatedPrice?: ShopwareCalculatedPrice;
  calculatedPrices?: ShopwareCalculatedPrice[];
  calculatedMaxPurchase?: number;
  calculatedCheapestPrice?: ShopwareCheapestPrice;
  isNew?: boolean;
  sortedProperties?: Record<string, unknown>;
  measurements?: ShopwareMeasurements;
  createdAt: string;
  updatedAt?: string;
  translated?: {
    name?: string;
    description?: string;
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string;
    packUnit?: string;
    packUnitPlural?: string;
  } & Record<string, unknown>;
  downloads?: ShopwareDownload[];
  parent?: ShopwareProduct;
  children?: ShopwareProduct[];
  deliveryTime?: ShopwareDeliveryTime;
  tax: ShopwareTax;
  manufacturer?: ShopwareManufacturer;
  unit?: ShopwareUnit;
  cover?: ShopwareProductMedia;
  cmsPage?: unknown; // Complex CMS structure
  canonicalProduct?: ShopwareProduct;
  media?: ShopwareProductMedia[];
  crossSellings?: ShopwareCrossSelling[];
  configuratorSettings?: ShopwareConfiguratorSetting[];
  productReviews?: ShopwareProductReview[];
  mainCategories?: unknown[];
  seoUrls?: ShopwareSeoUrl[];
  options?: ShopwarePropertyGroupOption[];
  properties?: ShopwarePropertyGroupOption[];
  categories?: ShopwareCategory[];
  streams?: unknown[];
  categoriesRo?: ShopwareCategory[];
  tags?: ShopwareTag[];
  seoCategory?: ShopwareCategory;
  apiAlias?: string;
  variantListingConfig?: {
    displayParent?: boolean;
  };
  mainVariantId?: string | null;
  externalReference?: string | null;
}

export interface ShopwareCalculatedPrice {
  unitPrice: number;
  quantity: number;
  rawTotal?: number;
  totalPrice: number;
  taxStatus?: 'net' | 'gross';
  calculatedTaxes?: ShopwareCalculatedTax[];
  referencePrice?: ShopwareReferencePrice;
  listPrice?: ShopwareCartListPrice;
  positionPrice?: number;
  netPrice?: number;
  regulationPrice?: ShopwareCartRegulationPrice;
  hasRange?: boolean;
  variantId?: string;
  apiAlias?: string;
  taxRules?: ShopwareTaxRule[];
}

export interface ShopwareCalculatedTax {
  apiAlias: string;
  tax: number;
  taxRate: number;
  price: number;
}

export interface ShopwareReferencePrice {
  purchaseUnit: number;
  referenceUnit: number;
  unitName: string;
  price: number;
  apiAlias: string;
  listPrice?: ShopwareCartListPrice;
  regulationPrice?: ShopwareCartRegulationPrice;
  hasRange?: boolean;
  variantId?: string;
}

export interface ShopwareCartListPrice {
  discount: number;
  percentage: number;
  price: number;
  apiAlias: string;
}

export interface ShopwareCartRegulationPrice {
  price: number;
  apiAlias?: string;
}

export interface ShopwareTaxRule {
  taxRate: number;
  name: string;
}

export interface ShopwareCheapestPrice {
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  referencePrice?: ShopwareReferencePrice;
  listPrice?: ShopwareCartListPrice;
  regulationPrice?: ShopwareCartRegulationPrice;
  hasRange?: boolean;
  variantId?: string;
  apiAlias: string;
}

export interface ShopwareMeasurements {
  width?: ShopwareMeasurement;
  height?: ShopwareMeasurement;
  length?: ShopwareMeasurement;
  weight?: ShopwareMeasurement;
}

export interface ShopwareMeasurement {
  unit: string;
  value: number;
}

export interface ShopwareDownload {
  id: string;
  versionId?: string;
  productId: string;
  productVersionId?: string;
  mediaId: string;
  position: number;
  customFields?: Record<string, unknown>;
  createdAt: string;
  updatedAt?: string;
  product?: ShopwareProduct;
  media?: ShopwareMedia;
}

export interface ShopwareDeliveryTime {
  id: string;
  name: string;
  min: number;
  max: number;
  unit: string;
  customFields?: Record<string, unknown>;
  createdAt: string;
  updatedAt?: string;
  translated?: Record<string, unknown>;
}

export interface ShopwareUnit {
  id: string;
  shortCode: string;
  name: string;
  customFields?: Record<string, unknown>;
  createdAt: string;
  updatedAt?: string;
  translated?: Record<string, unknown>;
}

export interface ShopwareProductMedia {
  id: string;
  versionId?: string;
  productId?: string;
  productVersionId?: string;
  mediaId: string;
  position: number;
  customFields?: Record<string, unknown>;
  createdAt: string;
  updatedAt?: string;
  media?: ShopwareMedia;
  url?: string; // Direct URL accessor
}

export interface ShopwareCrossSelling {
  id: string;
  name: string;
  position: number;
  sortBy: string;
  sortDirection: string;
  type: string;
  active: boolean;
  limit: number;
  createdAt: string;
  updatedAt?: string;
  translated?: Record<string, unknown>;
}

export interface ShopwareConfiguratorSetting {
  id: string;
  versionId?: string;
  productId: string;
  productVersionId?: string;
  mediaId?: string;
  optionId: string;
  position: number;
  customFields?: Record<string, unknown>;
  createdAt: string;
  updatedAt?: string;
  media?: ShopwareMedia;
  option?: ShopwarePropertyGroupOption;
}

export interface ShopwareProductReview {
  id: string;
  productId: string;
  productVersionId?: string;
  salesChannelId: string;
  languageId: string;
  externalUser?: string;
  title: string;
  content: string;
  points: number;
  status: boolean;
  comment?: string;
  customFields?: Record<string, unknown>;
  createdAt: string;
  updatedAt?: string;
}

export interface ShopwareSeoUrl {
  id: string;
  salesChannelId: string;
  languageId: string;
  foreignKey: string;
  routeName: string;
  pathInfo: string;
  seoPathInfo: string;
  isCanonical: boolean;
  isModified: boolean;
  isDeleted: boolean;
  error?: string;
  url: string;
  customFields?: Record<string, unknown>;
  createdAt: string;
  updatedAt?: string;
}

export interface ShopwareTag {
  id: string;
  name: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ShopwarePrice {
  currencyId: string;
  net: number;
  gross: number;
  linked: boolean;
  listPrice?: ShopwareListPrice;
  percentage?: ShopwarePercentage;
  regulationPrice?: ShopwareRegulationPrice;
}

export interface ShopwareListPrice {
  currencyId: string;
  net: number;
  gross: number;
  linked: boolean;
}

export interface ShopwarePercentage {
  net: number;
  gross: number;
}

export interface ShopwareRegulationPrice {
  currencyId: string;
  net: number;
  gross: number;
  linked: boolean;
}

export interface ShopwareTax {
  id: string;
  taxRate: number;
  name: string;
}

export interface ShopwareManufacturer {
  id: string;
  name: string;
  description?: string;
  link?: string;
  media?: ShopwareMedia;
}

export interface ShopwareMedia {
  id: string;
  fileName: string;
  fileExtension: string;
  fileSize: number;
  mimeType: string;
  metaData?: Record<string, unknown>;
  alt?: string;
  title?: string;
  url: string;
  thumbnails?: ShopwareMediaThumbnail[];
}

export interface ShopwareMediaThumbnail {
  url: string;
  width: number;
  height: number;
}

export interface ShopwareCategory {
  id: string;
  name: string;
  description?: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
  parent?: ShopwareCategory;
  children?: ShopwareCategory[];
  media?: ShopwareMedia;
  level: number;
  path?: string;
  childCount: number;
  type: string;
  productAssignmentType: string;
  visible: boolean;
  active: boolean;
  breadcrumb?: string[];
  customFields?: Record<string, unknown>;
  translated?: {
    name?: string;
    description?: string;
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string;
  } & Record<string, unknown>;
  products?: ShopwareProduct[];
}

export interface ShopwareProperty {
  id: string;
  name: string;
  description?: string;
  displayType: string;
  sortingType: string;
  filterable: boolean;
  position: number;
  customFields?: Record<string, unknown>;
  options?: ShopwarePropertyGroupOption[];
  translated?: Record<string, unknown>;
}

export interface ShopwarePropertyGroupOption {
  id: string;
  name: string;
  position: number;
  colorHexCode?: string;
  media?: ShopwareMedia;
  group?: ShopwareProperty;
  productConfiguratorSettings?: Record<string, unknown>[];
  productProperties?: Record<string, unknown>[];
  customFields?: Record<string, unknown>;
  translated?: Record<string, unknown>;
}

export interface ShopwareCustomer {
  id: string;
  customerNumber: string;
  salutationId?: string;
  firstName: string;
  lastName: string;
  email: string;
  title?: string;
  active: boolean;
  guest: boolean;
  firstLogin?: string;
  lastLogin?: string;
  birthday?: string;
  lastOrderDate?: string;
  orderCount: number;
  customFields?: Record<string, unknown>;
  groupId: string;
  defaultPaymentMethodId: string;
  defaultShippingAddressId?: string;
  defaultBillingAddressId?: string;
  addresses?: ShopwareCustomerAddress[];
  orderCustomers?: Record<string, unknown>[];
  autoIncrement: number;
  tags?: Record<string, unknown>[];
  promotions?: Record<string, unknown>[];
  remoteAddress?: string;
  requestedGroupId?: string;
  boundSalesChannelId?: string;
  languageId?: string;
  salesChannelId: string;
  lastPaymentMethodId?: string;
  doubleOptInRegistration: boolean;
  doubleOptInEmailSentDate?: string;
  doubleOptInConfirmDate?: string;
  hash?: string;
  recoveryCustomer?: Record<string, unknown>;
  createdAt: string;
  updatedAt?: string;
}

export interface ShopwareCustomerAddress {
  id: string;
  customerId: string;
  countryId: string;
  countryStateId?: string;
  salutationId?: string;
  firstName: string;
  lastName: string;
  zipcode?: string;
  city: string;
  company?: string;
  street: string;
  department?: string;
  title?: string;
  phoneNumber?: string;
  additionalAddressLine1?: string;
  additionalAddressLine2?: string;
  customFields?: Record<string, unknown>;
  country?: ShopwareCountry;
  countryState?: ShopwareCountryState;
  customer?: ShopwareCustomer;
  createdAt: string;
  updatedAt?: string;
}

export interface ShopwareCountry {
  id: string;
  name: string;
  iso: string;
  position: number;
  active: boolean;
  shippingAvailable: boolean;
  iso3?: string;
  displayStateInRegistration: boolean;
  forceStateInRegistration: boolean;
  checkVatIdPattern: boolean;
  vatIdPattern?: string;
  customFields?: Record<string, unknown>;
  states?: ShopwareCountryState[];
  translated?: Record<string, unknown>;
  customerTax?: ShopwareCustomerTax;
  companyTax?: ShopwareCompanyTax;
  taxFreeFrom?: number;
  taxFreeDisplay: boolean;
  currencyId?: string;
  taxFreeVatDisplay: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface ShopwareCountryState {
  id: string;
  countryId: string;
  shortCode: string;
  name: string;
  position: number;
  active: boolean;
  customFields?: Record<string, unknown>;
  country?: ShopwareCountry;
  translated?: Record<string, unknown>;
  createdAt: string;
  updatedAt?: string;
}

export interface ShopwareCustomerTax {
  amount: number;
  currencyId: string;
  enabled: boolean;
}

export interface ShopwareCompanyTax {
  amount: number;
  currencyId: string;
  enabled: boolean;
}

export interface ShopwareCart {
  token: string;
  name: string;
  lineItems: ShopwareLineItem[];
  price: ShopwareCartPrice;
  shippingCosts: ShopwareShippingCosts;
  errors?: ShopwareCartError[];
  modified: boolean;
  customerComment?: string;
  affiliateCode?: string;
  campaignCode?: string;
  contextToken: string;
  salesChannelId: string;
}

export interface ShopwareLineItem {
  id: string;
  referencedId?: string;
  label: string;
  quantity: number;
  type: string;
  payload: Record<string, unknown>;
  priceDefinition?: Record<string, unknown>;
  price?: ShopwareCalculatedPrice;
  good: boolean;
  description?: string;
  cover?: ShopwareMedia;
  deliveryInformation?: ShopwareDeliveryInformation;
  children?: ShopwareLineItem[];
  requirement?: Record<string, unknown>;
  removable: boolean;
  stackable: boolean;
  quantityInformation?: ShopwareQuantityInformation;
  modified: boolean;
}

export interface ShopwareDeliveryInformation {
  stock: number;
  weight?: number;
  freeDelivery: boolean;
  restockTime?: number;
}

export interface ShopwareQuantityInformation {
  minPurchase: number;
  maxPurchase?: number;
  purchaseSteps: number;
}

export interface ShopwareCartPrice {
  netPrice: number;
  totalPrice: number;
  calculatedTaxes: ShopwareCalculatedTax[];
  taxRules: ShopwareTaxRule[];
  positionPrice: number;
  taxStatus: string;
  rawTotal: number;
}

export interface ShopwareShippingCosts {
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  calculatedTaxes: ShopwareCalculatedTax[];
  taxRules: ShopwareTaxRule[];
  referencePrice?: ShopwareReferencePrice;
  listPrice?: ShopwareListPrice;
}

export interface ShopwareCartError {
  key: string;
  level: number;
  message: string;
  messageKey: string;
}

export interface ShopwareOrder {
  id: string;
  orderNumber: string;
  orderDateTime: string;
  orderDate: string;
  price: ShopwareCartPrice;
  amountTotal: number;
  amountNet: number;
  positionPrice: number;
  taxStatus: string;
  shippingCosts: ShopwareShippingCosts;
  shippingTotal: number;
  currencyId: string;
  currencyFactor: number;
  salesChannelId: string;
  billingAddressId: string;
  orderCustomer: ShopwareOrderCustomer;
  currency: ShopwareCurrency;
  addresses: ShopwareOrderAddress[];
  billingAddress: ShopwareOrderAddress;
  deliveries: ShopwareOrderDelivery[];
  lineItems: ShopwareOrderLineItem[];
  transactions: ShopwareOrderTransaction[];
  deepLinkCode?: string;
  autoIncrement: number;
  stateMachineState: ShopwareStateMachineState;
  stateId: string;
  customFields?: Record<string, unknown>;
  createdAt: string;
  updatedAt?: string;
}

export interface ShopwareOrderCustomer {
  id: string;
  customerId?: string;
  orderId: string;
  email: string;
  salutationId?: string;
  firstName: string;
  lastName: string;
  title?: string;
  customerNumber?: string;
  customFields?: Record<string, unknown>;
  customer?: ShopwareCustomer;
  salutation?: ShopwareSalutation;
  order?: ShopwareOrder;
  remoteAddress?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ShopwareCurrency {
  id: string;
  factor: number;
  symbol: string;
  isoCode: string;
  shortName: string;
  name: string;
  position: number;
  decimalPrecision: number;
  customFields?: Record<string, unknown>;
  isSystemDefault?: boolean;
  orders?: ShopwareOrder[];
  salesChannels?: Record<string, unknown>[];
  salesChannelDefaultAssignments?: Record<string, unknown>[];
  salesChannelDomains?: Record<string, unknown>[];
  promotionDiscountPrices?: Record<string, unknown>[];
  productExports?: Record<string, unknown>[];
  countryRoundings?: Record<string, unknown>[];
  translated?: Record<string, unknown>;
  createdAt: string;
  updatedAt?: string;
}

export interface ShopwareOrderAddress {
  id: string;
  orderId: string;
  orderVersionId: string;
  countryId: string;
  countryStateId?: string;
  salutationId?: string;
  firstName: string;
  lastName: string;
  zipcode?: string;
  city: string;
  company?: string;
  street: string;
  department?: string;
  title?: string;
  vatId?: string;
  phoneNumber?: string;
  additionalAddressLine1?: string;
  additionalAddressLine2?: string;
  customFields?: Record<string, unknown>;
  country: ShopwareCountry;
  countryState?: ShopwareCountryState;
  order?: ShopwareOrder;
  salutation?: ShopwareSalutation;
  orderDeliveries?: ShopwareOrderDelivery[];
  createdAt: string;
  updatedAt?: string;
}

export interface ShopwareSalutation {
  id: string;
  salutationKey: string;
  displayName: string;
  letterName: string;
  translated?: Record<string, unknown>;
  customers?: ShopwareCustomer[];
  customerAddresses?: ShopwareCustomerAddress[];
  orderCustomers?: ShopwareOrderCustomer[];
  orderAddresses?: ShopwareOrderAddress[];
  newsletterRecipients?: Record<string, unknown>[];
  customFields?: Record<string, unknown>;
  createdAt: string;
  updatedAt?: string;
}

export interface ShopwareOrderDelivery {
  id: string;
  orderId: string;
  orderVersionId: string;
  shippingOrderAddressId: string;
  shippingMethodId: string;
  stateId: string;
  stateMachineState: ShopwareStateMachineState;
  trackingCodes: string[];
  shippingDateEarliest: string;
  shippingDateLatest: string;
  shippingCosts: ShopwareShippingCosts;
  customFields?: Record<string, unknown>;
  order?: ShopwareOrder;
  shippingOrderAddress: ShopwareOrderAddress;
  shippingMethod: ShopwareShippingMethod;
  positions: ShopwareOrderDeliveryPosition[];
  createdAt: string;
  updatedAt?: string;
}

export interface ShopwareShippingMethod {
  id: string;
  name: string;
  active: boolean;
  position: number;
  customFields?: Record<string, unknown>;
  mediaId?: string;
  deliveryTimeId: string;
  taxType: string;
  taxId?: string;
  media?: ShopwareMedia;
  prices?: ShopwareShippingMethodPrice[];
  deliveryTime: ShopwareDeliveryTime;
  translated?: Record<string, unknown>;
  orderDeliveries?: ShopwareOrderDelivery[];
  salesChannelDefaultAssignments?: Record<string, unknown>[];
  tax?: ShopwareTax;
  createdAt: string;
  updatedAt?: string;
}

export interface ShopwareShippingMethodPrice {
  id: string;
  shippingMethodId: string;
  ruleId?: string;
  calculation: number;
  calculationRuleId?: string;
  quantityStart?: number;
  quantityEnd?: number;
  currencyPrice: ShopwarePrice[];
  customFields?: Record<string, unknown>;
  shippingMethod?: ShopwareShippingMethod;
  rule?: Record<string, unknown>;
  calculationRule?: Record<string, unknown>;
  createdAt: string;
  updatedAt?: string;
}

export interface ShopwareDeliveryTime {
  id: string;
  name: string;
  min: number;
  max: number;
  unit: string;
  customFields?: Record<string, unknown>;
  shippingMethods?: ShopwareShippingMethod[];
  products?: ShopwareProduct[];
  translated?: Record<string, unknown>;
  createdAt: string;
  updatedAt?: string;
}

export interface ShopwareOrderDeliveryPosition {
  id: string;
  orderDeliveryId: string;
  orderDeliveryVersionId: string;
  orderLineItemId: string;
  orderLineItemVersionId: string;
  price: ShopwareCalculatedPrice;
  unitPrice: number;
  totalPrice: number;
  quantity: number;
  customFields?: Record<string, unknown>;
  orderDelivery?: ShopwareOrderDelivery;
  orderLineItem: ShopwareOrderLineItem;
  createdAt: string;
  updatedAt?: string;
}

export interface ShopwareOrderLineItem {
  id: string;
  orderId: string;
  orderVersionId: string;
  productId?: string;
  productVersionId?: string;
  parentId?: string;
  parentVersionId?: string;
  identifier: string;
  referencedId?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  label: string;
  description?: string;
  good: boolean;
  removable: boolean;
  stackable: boolean;
  position: number;
  price: ShopwareCalculatedPrice;
  priceDefinition?: Record<string, unknown>;
  payload?: Record<string, unknown>;
  type: string;
  customFields?: Record<string, unknown>;
  order?: ShopwareOrder;
  product?: ShopwareProduct;
  parent?: ShopwareOrderLineItem;
  children?: ShopwareOrderLineItem[];
  orderDeliveryPositions?: ShopwareOrderDeliveryPosition[];
  cover?: ShopwareMedia;
  createdAt: string;
  updatedAt?: string;
}

export interface ShopwareOrderTransaction {
  id: string;
  orderId: string;
  orderVersionId: string;
  paymentMethodId: string;
  amount: ShopwareCalculatedPrice;
  stateId: string;
  stateMachineState: ShopwareStateMachineState;
  customFields?: Record<string, unknown>;
  order?: ShopwareOrder;
  paymentMethod: ShopwarePaymentMethod;
  captures?: Record<string, unknown>[];
  createdAt: string;
  updatedAt?: string;
}

export interface ShopwarePaymentMethod {
  id: string;
  name: string;
  distinguishableName?: string;
  description?: string;
  position: number;
  active: boolean;
  afterOrderEnabled: boolean;
  customFields?: Record<string, unknown>;
  mediaId?: string;
  formattedHandlerIdentifier: string;
  synchronous: boolean;
  asynchronous: boolean;
  prepared: boolean;
  refundable: boolean;
  recurring: boolean;
  shortName?: string;
  media?: ShopwareMedia;
  availabilityRule?: Record<string, unknown>;
  salesChannelDefaultAssignments?: Record<string, unknown>[];
  plugin?: Record<string, unknown>;
  orderTransactions?: ShopwareOrderTransaction[];
  customers?: ShopwareCustomer[];
  translated?: Record<string, unknown>;
  createdAt: string;
  updatedAt?: string;
}

export interface ShopwareStateMachineState {
  id: string;
  name: string;
  technicalName: string;
  stateMachineId: string;
  customFields?: Record<string, unknown>;
  fromStateMachineTransitions?: Record<string, unknown>[];
  toStateMachineTransitions?: Record<string, unknown>[];
  translations?: Record<string, unknown>[];
  orders?: ShopwareOrder[];
  orderTransactions?: ShopwareOrderTransaction[];
  orderDeliveries?: ShopwareOrderDelivery[];
  stateMachine?: Record<string, unknown>;
  translated?: Record<string, unknown>;
  createdAt: string;
  updatedAt?: string;
}

// API Response interfaces
export interface ShopwareApiResponse<T> {
  data: T;
  meta?: {
    total: number;
    count: number;
  };
  included?: Record<string, unknown>;
  errors?: ShopwareApiError[];
}

export interface ShopwareApiError {
  id: string;
  status: string;
  code: string;
  title: string;
  detail: string;
  source?: {
    pointer: string;
  };
  meta?: Record<string, unknown>;
}

export interface ShopwareListResponse<T> {
  data: T[];
  meta: {
    total: number;
    count: number;
  };
  included?: Record<string, unknown>;
  errors?: ShopwareApiError[];
}

// API Request interfaces
export interface ShopwareProductListParams {
  page?: number;
  limit?: number;
  term?: string;
  sort?: string;
  search?: string;
  filter?: ShopwareFilter[];
  ids?: string[];
  query?: string;
  associations?: Record<string, ShopwareAssociation>;
  'post-filter'?: ShopwareFilter[];
  aggregations?: ShopwareAggregation[];
  fields?: string[];
  grouping?: string[];
  'total-count-mode'?: 'none' | 'exact' | 'next-pages';
  includes?: Record<string, string[]>;
}

export interface ShopwareFilter {
  type: 'contains' | 'equals' | 'range' | 'multi' | 'not' | 'prefix' | 'suffix';
  field: string;
  value: string | number | boolean | string[];
  operator?: 'and' | 'or';
  parameters?: Record<string, unknown>;
}

export interface ShopwareAssociation {
  page?: number;
  term?: string;
  limit?: number;
  filter?: ShopwareFilter[];
  ids?: string[];
  query?: string;
  associations?: Record<string, ShopwareAssociation>;
  'post-filter'?: ShopwareFilter[];
  sort?: ShopwareSort[];
  aggregations?: ShopwareAggregation[];
  fields?: string[];
  grouping?: string[];
  'total-count-mode'?: 'none' | 'exact' | 'next-pages';
  includes?: Record<string, string[]>;
}

export interface ShopwareSort {
  field: string;
  order: 'ASC' | 'DESC';
  naturalSorting?: boolean;
  type?: string;
}

export interface ShopwareAggregation {
  name: string;
  type: 'avg' | 'count' | 'max' | 'min' | 'sum' | 'stats' | 'terms' | 'filter' | 'entity' | 'histogram' | 'range';
  field: string;
  aggregation?: ShopwareAggregation;
}

export interface ShopwareProductListResponse {
  total: number;
  elements: ShopwareProduct[];
  aggregations?: Record<string, ShopwareAggregationResult>;
  page: number;
  limit: number;
  hasNext?: boolean;
}

export interface ShopwareAggregationResult {
  buckets?: Array<{
    key: string;
    count: number;
    entities?: ShopwareProduct[];
  }>;
  value?: number;
  min?: number;
  max?: number;
  avg?: number;
  sum?: number;
  count?: number;
}

export interface ShopwareCategoryListParams {
  page?: number;
  limit?: number;
  term?: string;
  sort?: string;
  search?: string;
  filter?: ShopwareFilter[];
  ids?: string[];
  query?: string;
  associations?: Record<string, ShopwareAssociation>;
  'post-filter'?: ShopwareFilter[];
  aggregations?: ShopwareAggregation[];
  fields?: string[];
  grouping?: string[];
  'total-count-mode'?: 'none' | 'exact' | 'next-pages';
  includes?: Record<string, string[]>;
}

export interface ShopwareCartLineItemRequest {
  type: string;
  referencedId: string;
  quantity: number;
  payload?: Record<string, unknown>;
  priceDefinition?: Record<string, unknown>;
  stackable?: boolean;
  removable?: boolean;
  label?: string;
  description?: string;
}

export interface ShopwareCustomerRegistrationRequest {
  salutationId?: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  billingAddress: {
    salutationId?: string;
    firstName: string;
    lastName: string;
    street: string;
    zipcode: string;
    city: string;
    countryId: string;
    countryStateId?: string;
    company?: string;
    department?: string;
    title?: string;
    phoneNumber?: string;
    additionalAddressLine1?: string;
    additionalAddressLine2?: string;
  };
  shippingAddress?: {
    salutationId?: string;
    firstName: string;
    lastName: string;
    street: string;
    zipcode: string;
    city: string;
    countryId: string;
    countryStateId?: string;
    company?: string;
    department?: string;
    title?: string;
    phoneNumber?: string;
    additionalAddressLine1?: string;
    additionalAddressLine2?: string;
  };
  accountType?: string;
  guest?: boolean;
  customFields?: Record<string, unknown>;
}

export interface ShopwareCustomerLoginRequest {
  email: string;
  password: string;
}

export interface ShopwareOrderRequest {
  customerComment?: string;
  affiliateCode?: string;
  campaignCode?: string;
}

// Product Listing Response Interface
export interface ShopwareProductListingResponse {
  entity: string;
  total: number;
  aggregations: Record<string, unknown>[];
  page: number;
  limit: number;
  currentFilters: {
    navigationId?: string;
    manufacturer?: string[];
    price?: {
      min?: number;
      max?: number;
    };
    rating?: number;
    'shipping-free'?: boolean;
    properties?: string[];
    search?: string;
  };
  availableSortings: Array<{
    label: string;
    translated: {
      label: string;
    };
    key: string;
    priority: number;
    apiAlias: string;
  }>;
  sorting: string;
  elements: ShopwareProduct[];
  apiAlias: string;
}

// Product Listing Request Parameters
export interface ShopwareProductListingParams {
  page?: number;
  limit?: number;
  order?: string;
  search?: string;
  'manufacturer[]'?: string[];
  'min-price'?: number;
  'max-price'?: number;
  rating?: number;
  'shipping-free'?: boolean;
  'properties[]'?: string[];
}

// Product Detail Response
export interface ShopwareProductDetailResponse {
  apiAlias: 'product_detail';
  product: ShopwareProduct;
  configurator: unknown[];
}