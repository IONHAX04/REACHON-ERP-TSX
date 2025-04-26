import { Document, Font, Image, Page, Text, View } from '@react-pdf/renderer'
import React from 'react'
import PopRegular from '../../assets/Fonts/Poppins-Regular.ttf'
import PopBold from '../../assets/Fonts/Poppins-Bold.ttf'
import PopBoldItalic from '../../assets/Fonts/Poppins-BoldItalic.ttf'
import PopSemiboldItalic from '../../assets/Fonts/Poppins-SemiBoldItalic.ttf'
import logo from '../../assets/Logo/LOGO.png'
import barcode from '../../assets/PDFTemplate/Barcode.png'
import cut from '../../assets/PDFTemplate/Cut.png'

const TestingPDF: React.FC = () => {
  Font.register({ family: 'PopRegular', src: PopRegular })
  Font.register({ family: 'PopBoldItalic', src: PopBoldItalic })
  Font.register({ family: 'PopBold', src: PopBold })
  Font.register({ family: 'PopSemiboldItalic', src: PopSemiboldItalic })
  return (
    <Document>
      <Page size="A4">
        <View
          style={{
            padding: 20,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%'
          }}
        >
          {/* Row-1 */}
          <View
            style={{
              width: '100%',
              height: '80px',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              border: '1px solid #000'
            }}
          >
            <View
              style={{
                width: '40%',
                height: '80px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                borderRight: '1px solid #000',
                padding: '10px'
              }}
            >
              <Image src={logo} style={{ width: '45%', marginBottom: '10px' }} />
              <View
                style={{
                  fontSize: '7px',
                  fontFamily: 'PopBold',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <Text>Reachon Express Private Limited</Text>
                <Text>No 118 Gandhiji Road, Erode HO,</Text>
                <Text>Erode - 638001 (Near Railway Station)</Text>
              </View>
            </View>
            <View
              style={{
                width: '30%',
                height: '80px',
                borderRight: '1px solid #000'
              }}
            >
              <View
                style={{
                  width: '100%',
                  fontSize: '8px',
                  height: '40px',
                  display: 'flex',
                  flexDirection: 'row',
                  borderBottom: '1px solid #000',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '3px'
                }}
              >
                <Text>Origin:</Text>
                <Text style={{ fontFamily: 'PopBold' }}>DINDIGUL - E07</Text>
              </View>
              <View
                style={{
                  width: '100%',
                  fontSize: '8px',
                  height: '40px',
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '3px'
                }}
              >
                <Text>Product:</Text>
                <Text style={{ fontFamily: 'PopBold' }}>Ground Express</Text>
              </View>
            </View>
            <View
              style={{
                width: '30%',
                height: '80px'
              }}
            >
              <View
                style={{
                  width: '100%',
                  fontSize: '8px',
                  height: '26px',
                  display: 'flex',
                  flexDirection: 'row',
                  borderBottom: '1px solid #000',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '3px'
                }}
              >
                <Text>Dest:</Text>
                <Text style={{ fontFamily: 'PopBold' }}>COIMBATORE - E01</Text>
              </View>
              <View
                style={{
                  width: '100%',
                  fontSize: '8px',
                  height: '26px',
                  display: 'flex',
                  borderBottom: '1px solid #000',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '3px'
                }}
              >
                <Text>Type:</Text>
                <Text style={{ fontFamily: 'PopBold' }}>NON-DOCUMENT</Text>
              </View>
              <View
                style={{
                  width: '100%',
                  fontSize: '8px',
                  height: '28px',
                  display: 'flex',
                  borderBottom: '1px solid #000',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '3px'
                }}
              >
                <Text>Date:</Text>
                <Text style={{ fontFamily: 'PopBold' }}>Wed Dec 01 2021</Text>
              </View>
            </View>
          </View>

          {/* Row-2 */}
          <View
            style={{
              width: '100%',
              height: '80px',
              display: 'flex',
              flexDirection: 'row',
              borderRight: '1px solid #000',
              borderLeft: '1px solid #000',
              borderBottom: '1px solid #000'
            }}
          >
            <View
              style={{
                width: '50%',
                height: '80px',
                display: 'flex',
                flexDirection: 'column',
                borderRight: '1px solid #000',
                padding: '5px',
                fontSize: '8px'
              }}
            >
              <View
                style={{
                  width: '100%',
                  fontSize: '8px',
                  display: 'flex',
                  flexDirection: 'row',
                  gap: '3px'
                }}
              >
                <Text>Consignor's Name:</Text>
                <Text style={{ fontFamily: 'PopBold' }}>GOWTHAM KK</Text>
              </View>
              <View
                style={{
                  width: '100%',
                  fontSize: '8px',
                  display: 'flex',
                  flexDirection: 'row',
                  gap: '3px'
                }}
              >
                <Text>Consignor's Address:</Text>
                <Text style={{ fontFamily: 'PopBold' }}>DINDIGUL, TAMIL NADU, 624001</Text>
              </View>
              <View
                style={{
                  width: '100%',
                  fontSize: '8px',
                  display: 'flex',
                  flexDirection: 'row',
                  gap: '3px'
                }}
              >
                <Text>GSTIN No:</Text>
                <Text style={{ fontFamily: 'PopBold' }}> </Text>
              </View>
              <View
                style={{
                  width: '100%',
                  fontSize: '8px',
                  display: 'flex',
                  flexDirection: 'row',
                  gap: '3px'
                }}
              >
                <Text>Phone No:</Text>
                <Text style={{ fontFamily: 'PopBold' }}>9566996478</Text>
              </View>
              <View
                style={{
                  width: '100%',
                  fontSize: '8px',
                  display: 'flex',
                  flexDirection: 'row',
                  gap: '3px'
                }}
              >
                <Text>Email:</Text>
                <Text style={{ fontFamily: 'PopBold' }}></Text>
              </View>
            </View>
            <View
              style={{
                width: '50%',
                height: '80px',
                display: 'flex',
                flexDirection: 'column',
                // borderRight: "1px solid #000",
                padding: '5px',
                fontSize: '8px'
              }}
            >
              <View
                style={{
                  width: '100%',
                  fontSize: '8px',
                  display: 'flex',
                  flexDirection: 'row',
                  gap: '3px'
                }}
              >
                <Text>Customer Ref No:</Text>
                <Text style={{ fontFamily: 'PopBold' }}> </Text>
              </View>
              <View
                style={{
                  width: '100%',
                  fontSize: '8px',
                  display: 'flex',
                  flexDirection: 'row',
                  gap: '3px'
                }}
              >
                <Text>Consignee's Name:</Text>
                <Text style={{ fontFamily: 'PopBold' }}>S. Vinoth</Text>
              </View>
              <View
                style={{
                  width: '100%',
                  fontSize: '8px',
                  display: 'flex',
                  flexDirection: 'row',
                  gap: '3px'
                }}
              >
                <Text>Consignee's Address:</Text>
                <Text style={{ fontFamily: 'PopBold' }}>COIMBATORE, TAMIL NADU, 641028</Text>
              </View>
              <View
                style={{
                  width: '100%',
                  fontSize: '8px',
                  display: 'flex',
                  flexDirection: 'row',
                  gap: '3px'
                }}
              >
                <Text>GSTIN No:</Text>
                <Text style={{ fontFamily: 'PopBold' }}> </Text>
              </View>
              <View
                style={{
                  width: '100%',
                  fontSize: '8px',
                  display: 'flex',
                  flexDirection: 'row',
                  gap: '3px'
                }}
              >
                <Text>Phone No:</Text>
                <Text style={{ fontFamily: 'PopBold' }}>9566996478</Text>
              </View>
              <View
                style={{
                  width: '100%',
                  fontSize: '8px',
                  display: 'flex',
                  flexDirection: 'row',
                  gap: '3px'
                }}
              >
                <Text>Email:</Text>
                <Text style={{ fontFamily: 'PopBold' }}></Text>
              </View>
            </View>
          </View>

          {/* Row-3 */}
          <View
            style={{
              width: '100%',
              height: '120px',
              display: 'flex',
              flexDirection: 'row',
              borderRight: '1px solid #000',
              borderLeft: '1px solid #000'
            }}
          >
            <View
              style={{
                width: '25%',
                height: '120px'
              }}
            >
              <View
                style={{
                  width: '100%',
                  height: '40px',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRight: '1px solid #000',
                  borderBottom: '1px solid #000',
                  padding: '5px',
                  fontSize: '8px'
                }}
              >
                <View
                  style={{
                    width: '100%',
                    fontSize: '7px',
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '3px'
                  }}
                >
                  <Text style={{ fontFamily: 'PopBold' }}>Content Specification:</Text>
                  <Text>CUP</Text>
                </View>
                <View
                  style={{
                    width: '100%',
                    fontSize: '7px',
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '3px'
                  }}
                >
                  <Text style={{ fontFamily: 'PopBold' }}>Paper Enclosed:</Text>
                  <Text></Text>
                </View>
              </View>

              <View
                style={{
                  width: '100%',
                  height: '80px',
                  borderRight: '1px solid #000',
                  borderBottom: '1px solid #000',
                  fontSize: '5px',
                  fontFamily: 'PopRegular',
                  textAlign: 'justify',
                  padding: '5px 5px'
                }}
              >
                <Text style={{ textAlign: 'justify' }}>
                  I/We declare that this consignment does not contain personal mail, cash,
                  jewellery, contraband, illegal drugs, any prohibited items and commodities which
                  can cause safety hazards while transporting
                </Text>
                <Text
                  style={{
                    textAlign: 'center',
                    marginTop: '10px',
                    fontFamily: 'PopBold',
                    textDecoration: 'underline'
                  }}
                >
                  Sende's Signature & Seal
                </Text>
                <Text style={{ textAlign: 'justify', marginTop: '2px' }}>
                  I have read and understood terms & conditions ofcarriage mentioned on website
                  www.dtdc.in, and I agree to the Same.
                </Text>
              </View>
            </View>
            <View
              style={{
                width: '25%',
                height: '120px'
              }}
            >
              <View
                style={{
                  width: '100%',
                  height: '40px',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRight: '1px solid #000',
                  borderBottom: '1px solid #000',
                  fontSize: '8px'
                }}
              >
                <View
                  style={{
                    width: '100%',
                    fontSize: '7px',
                    height: '13px',
                    borderBottom: '1px solid #000',
                    display: 'flex',
                    flexDirection: 'row',
                    paddingLeft: '3px',
                    // justifyContent: "center",
                    alignItems: 'center',
                    gap: '3px'
                  }}
                >
                  <Text>Declared Value:</Text>
                  <Text style={{ fontFamily: 'PopBold' }}>30000</Text>
                </View>
                <View
                  style={{
                    width: '100%',
                    fontSize: '7px',
                    height: '13px',
                    borderBottom: '1px solid #000',
                    display: 'flex',
                    flexDirection: 'row',
                    paddingLeft: '3px',
                    // justifyContent: "center",
                    alignItems: 'center',
                    gap: '3px'
                  }}
                >
                  <Text>No Of Pieces:</Text>
                  <Text style={{ fontFamily: 'PopBold' }}>1</Text>
                </View>
                <View
                  style={{
                    width: '100%',
                    fontSize: '7px',
                    height: '14px',
                    display: 'flex',
                    flexDirection: 'row',
                    paddingLeft: '3px',
                    // justifyContent: "center",
                    alignItems: 'center',
                    gap: '3px'
                  }}
                >
                  <Text>Actual Weight:</Text>
                  <Text style={{ fontFamily: 'PopBold' }}>16.215 Kgs</Text>
                </View>
              </View>
              <View
                style={{
                  width: '100%',
                  height: '26px',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRight: '1px solid #000',
                  borderBottom: '1px solid #000',
                  fontSize: '8px'
                }}
              >
                <View
                  style={{
                    width: '100%',
                    fontSize: '7px',
                    height: '13px',
                    borderBottom: '1px solid #000',
                    display: 'flex',
                    flexDirection: 'row',
                    paddingLeft: '3px',
                    // justifyContent: "center",
                    alignItems: 'center',
                    gap: '3px'
                  }}
                >
                  <Text>Dim:</Text>
                  <Text style={{ fontFamily: 'PopBold' }}>1 cm X 1 cm X 1 cm</Text>
                </View>

                <View
                  style={{
                    width: '100%',
                    fontSize: '7px',
                    height: '13px',
                    display: 'flex',
                    flexDirection: 'row',
                    paddingLeft: '3px',
                    // justifyContent: "center",
                    alignItems: 'center',
                    gap: '3px'
                  }}
                >
                  <Text>Charged weight:</Text>
                  <Text style={{ fontFamily: 'PopBold' }}>16.215 Kgs</Text>
                </View>
              </View>
              <View
                style={{
                  width: '100%',
                  height: '54px',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRight: '1px solid #000',
                  borderBottom: '1px solid #000',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  fontSize: 5
                }}
              >
                <View
                  style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    paddingLeft: '3px',
                    // justifyContent: "center",
                    alignItems: 'center',
                    gap: '3px'
                  }}
                >
                  <Text style={{ fontFamily: 'PopBold' }}>Name:</Text>
                  <Text>SELLAPADI</Text>
                </View>
                <View
                  style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    paddingLeft: 3,
                    // justifyContent: "center",
                    alignItems: 'flex-start'
                    // gap: "3px",
                  }}
                >
                  <Text style={{ width: '18%', fontFamily: 'PopBold' }}>Address:</Text>
                  <Text style={{ width: '75%' }}>
                    Navaladiyar Complex, 26/aarthi Theater Road, VMRP,-,DGL,636307
                  </Text>
                </View>
                <View
                  style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    paddingLeft: '3px',
                    // justifyContent: "center",
                    alignItems: 'center',
                    gap: '3px'
                  }}
                >
                  <Text style={{ fontFamily: 'PopBold' }}>Phone:</Text>
                  <Text>7598057298</Text>
                </View>
              </View>
            </View>
            <View
              style={{
                width: '50%',
                height: '120px'
              }}
            >
              <View
                style={{
                  width: '100%',
                  height: '66px',
                  display: 'flex',
                  flexDirection: 'column',
                  borderBottom: '1px solid #000',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '5px',
                  fontSize: 8
                }}
              >
                <Image src={barcode} style={{ width: '80%' }} />
                <View
                  style={{
                    width: '100%',
                    fontSize: '8px',
                    display: 'flex',
                    justifyContent: 'center',
                    // alignItems: "ceter",
                    flexDirection: 'row',
                    gap: '3px',
                    paddingTop: '5px'
                  }}
                >
                  <Text style={{ marginTop: '1px' }}>AWB No:</Text>
                  <Text style={{ fontFamily: 'PopBold' }}>D83049959</Text>
                </View>
              </View>
              <View
                style={{
                  width: '100%',
                  height: '66px',
                  display: 'flex',
                  flexDirection: 'row',
                  borderBottom: '1px solid #000',
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontSize: '8px'
                }}
              >
                <View
                  style={{
                    width: '50%',
                    height: '60px',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRight: '1px solid #000',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontSize: '8px'
                  }}
                >
                  <Text style={{ fontSize: '10px', fontFamily: 'PopBold' }}>Risk Surcharge</Text>
                </View>

                <View
                  style={{
                    width: '50%',
                    height: '60px',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontSize: '8px'
                  }}
                >
                  <View style={{ width: '50%', height: '60px' }}>
                    <View
                      style={{
                        width: '100%',
                        height: '60px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontSize: '8px'
                      }}
                    >
                      <View
                        style={{
                          width: '100%',
                          height: '30px',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderBottom: '1px solid #000',
                          borderRight: '1px solid #000'
                        }}
                      >
                        <Text style={{ fontFamily: 'PopBold' }}>Owner</Text>
                      </View>
                      <View
                        style={{
                          width: '100%',
                          height: '30px',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderRight: '1px solid #000'
                        }}
                      >
                        <Text style={{ fontFamily: 'PopBold' }}>Carrier</Text>
                      </View>
                    </View>
                  </View>
                  <View style={{ width: '50%', height: '60px' }}>
                    <View
                      style={{
                        width: '100%',
                        height: '60px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontSize: '8px'
                      }}
                    >
                      <View
                        style={{
                          width: '100%',
                          height: '30px',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderBottom: '1px solid #000'
                        }}
                      >
                        <Text style={{ fontFamily: 'PopBold' }}></Text>
                      </View>
                      <View
                        style={{
                          width: '100%',
                          height: '30px',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center'
                        }}
                      >
                        <Text style={{ fontFamily: 'PopBold' }}></Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Row-4 */}
          <View
            style={{
              width: '100%',
              height: '20px',
              display: 'flex',
              flexDirection: 'row',
              borderRight: '1px solid #000',
              borderLeft: '1px solid #000',
              borderBottom: '1px solid #000'
            }}
          >
            <View
              style={{
                width: '50%',
                height: '20px',
                borderRight: '1px solid #000',
                fontFamily: 'PopBold',
                fontSize: '7px',
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center',
                flexDirection: 'row'
              }}
            >
              <Text>https:www.dtdc.in</Text>
              <Text>customersupport@dtdc.com</Text>
              <Text>+91-7305770577</Text>
            </View>
            <View
              style={{
                width: '50%',
                height: '20px',
                fontFamily: 'PopBold',
                fontSize: 7,
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
                flexDirection: 'row'
              }}
            >
              <Text style={{ paddingLeft: '5px' }}>Amount collected (in Rs.):</Text>
            </View>
          </View>

          {/* Row-5 */}
          <View
            style={{
              width: '100%',
              height: '15px',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              alignItems: 'center',
              borderRight: '1px solid #000',
              borderLeft: '1px solid #000',
              borderBottom: '1px solid #000'
            }}
          >
            <Text style={{ fontSize: '6px', fontFamily: 'PopBold' }}>
              DOCUMENT IS NOT A TAX INVOICE. WEIGHT CAPTURED BY DTDC WILL BE USED FOR INVOICE
              GENERATION.
            </Text>
            <Text style={{ fontSize: '6px', fontFamily: 'PopBold' }}>Sender's Copy</Text>
          </View>

          {/* Line Cut */}
          <View
            style={{
              width: '100%',
              height: '100px',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <View
              style={{
                width: '15%',
                borderBottom: '1px solid #000',
                borderStyle: 'dashed'
              }}
            ></View>
            <Image src={cut} style={{ height: '20px' }} />
            <View
              style={{
                width: '15%',
                borderBottom: '1px solid #000',
                borderStyle: 'dashed'
              }}
            ></View>
            <Image src={cut} style={{ height: '20px' }} />
            <View
              style={{
                width: '15%',
                borderBottom: '1px solid #000',
                borderStyle: 'dashed'
              }}
            ></View>
            <Image src={cut} style={{ height: '20px' }} />
            <View
              style={{
                width: '15%',
                borderBottom: '1px solid #000',
                borderStyle: 'dashed'
              }}
            ></View>
            <Image src={cut} style={{ height: '20px' }} />
            <View
              style={{
                width: '15%',
                borderBottom: '1px solid #000',
                borderStyle: 'dashed'
              }}
            ></View>
            <Image src={cut} style={{ height: '20px' }} />
            <View
              style={{
                width: '15%',
                borderBottom: '1px solid #000',
                borderStyle: 'dashed'
              }}
            ></View>
          </View>

          {/* Row-1 */}
          <View
            style={{
              width: '100%',
              height: '80px',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              border: '1px solid #000'
            }}
          >
            <View
              style={{
                width: '40%',
                height: '80px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                borderRight: '1px solid #000',
                padding: '10px'
              }}
            >
              <Image src={logo} style={{ width: '45%', marginBottom: '10px' }} />
              <View
                style={{
                  fontSize: '7px',
                  fontFamily: 'PopBold',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <Text>Reachon Express Private Limited</Text>
                <Text>No 118 Gandhiji Road, Erode HO,</Text>
                <Text>Erode - 638001 (Near Railway Station)</Text>
              </View>
            </View>
            <View
              style={{
                width: '30%',
                height: '80px',
                borderRight: '1px solid #000'
              }}
            >
              <View
                style={{
                  width: '100%',
                  fontSize: '8px',
                  height: '40px',
                  display: 'flex',
                  flexDirection: 'row',
                  borderBottom: '1px solid #000',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '3px'
                }}
              >
                <Text>Origin:</Text>
                <Text style={{ fontFamily: 'PopBold' }}>DINDIGUL - E07</Text>
              </View>
              <View
                style={{
                  width: '100%',
                  fontSize: '8px',
                  height: '40px',
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '3px'
                }}
              >
                <Text>Product:</Text>
                <Text style={{ fontFamily: 'PopBold' }}>Ground Express</Text>
              </View>
            </View>
            <View
              style={{
                width: '30%',
                height: '80px'
              }}
            >
              <View
                style={{
                  width: '100%',
                  fontSize: '8px',
                  height: '26px',
                  display: 'flex',
                  flexDirection: 'row',
                  borderBottom: '1px solid #000',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '3px'
                }}
              >
                <Text>Dest:</Text>
                <Text style={{ fontFamily: 'PopBold' }}>COIMBATORE - E01</Text>
              </View>
              <View
                style={{
                  width: '100%',
                  fontSize: '8px',
                  height: '26px',
                  display: 'flex',
                  borderBottom: '1px solid #000',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '3px'
                }}
              >
                <Text>Type:</Text>
                <Text style={{ fontFamily: 'PopBold' }}>NON-DOCUMENT</Text>
              </View>
              <View
                style={{
                  width: '100%',
                  fontSize: '8px',
                  height: '28px',
                  display: 'flex',
                  borderBottom: '1px solid #000',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '3px'
                }}
              >
                <Text>Date:</Text>
                <Text style={{ fontFamily: 'PopBold' }}>Wed Dec 01 2021</Text>
              </View>
            </View>
          </View>

          {/* Row-2 */}
          <View
            style={{
              width: '100%',
              height: '80px',
              display: 'flex',
              flexDirection: 'row',
              borderRight: '1px solid #000',
              borderLeft: '1px solid #000',
              borderBottom: '1px solid #000'
            }}
          >
            <View
              style={{
                width: '50%',
                height: '80px',
                display: 'flex',
                flexDirection: 'column',
                borderRight: '1px solid #000',
                padding: '5px',
                fontSize: '8px'
              }}
            >
              <View
                style={{
                  width: '100%',
                  fontSize: '8px',
                  display: 'flex',
                  flexDirection: 'row',
                  gap: '3px'
                }}
              >
                <Text>Consignor's Name:</Text>
                <Text style={{ fontFamily: 'PopBold' }}>GOWTHAM KK</Text>
              </View>
              <View
                style={{
                  width: '100%',
                  fontSize: '8px',
                  display: 'flex',
                  flexDirection: 'row',
                  gap: '3px'
                }}
              >
                <Text>Consignor's Address:</Text>
                <Text style={{ fontFamily: 'PopBold' }}>DINDIGUL, TAMIL NADU, 624001</Text>
              </View>
              <View
                style={{
                  width: '100%',
                  fontSize: '8px',
                  display: 'flex',
                  flexDirection: 'row',
                  gap: '3px'
                }}
              >
                <Text>GSTIN No:</Text>
                <Text style={{ fontFamily: 'PopBold' }}> </Text>
              </View>
              <View
                style={{
                  width: '100%',
                  fontSize: '8px',
                  display: 'flex',
                  flexDirection: 'row',
                  gap: '3px'
                }}
              >
                <Text>Phone No:</Text>
                <Text style={{ fontFamily: 'PopBold' }}>9566996478</Text>
              </View>
              <View
                style={{
                  width: '100%',
                  fontSize: '8px',
                  display: 'flex',
                  flexDirection: 'row',
                  gap: '3px'
                }}
              >
                <Text>Email:</Text>
                <Text style={{ fontFamily: 'PopBold' }}></Text>
              </View>
            </View>
            <View
              style={{
                width: '50%',
                height: '80px',
                display: 'flex',
                flexDirection: 'column',
                // borderRight: "1px solid #000",
                padding: '5px',
                fontSize: '8px'
              }}
            >
              <View
                style={{
                  width: '100%',
                  fontSize: '8px',
                  display: 'flex',
                  flexDirection: 'row',
                  gap: '3px'
                }}
              >
                <Text>Customer Ref No:</Text>
                <Text style={{ fontFamily: 'PopBold' }}> </Text>
              </View>
              <View
                style={{
                  width: '100%',
                  fontSize: '8px',
                  display: 'flex',
                  flexDirection: 'row',
                  gap: '3px'
                }}
              >
                <Text>Consignor's Name:</Text>
                <Text style={{ fontFamily: 'PopBold' }}>S. Vinoth</Text>
              </View>
              <View
                style={{
                  width: '100%',
                  fontSize: '8px',
                  display: 'flex',
                  flexDirection: 'row',
                  gap: '3px'
                }}
              >
                <Text>Consignor's Address:</Text>
                <Text style={{ fontFamily: 'PopBold' }}>COIMBATORE, TAMIL NADU, 641028</Text>
              </View>
              <View
                style={{
                  width: '100%',
                  fontSize: '8px',
                  display: 'flex',
                  flexDirection: 'row',
                  gap: '3px'
                }}
              >
                <Text>GSTIN No:</Text>
                <Text style={{ fontFamily: 'PopBold' }}> </Text>
              </View>
              <View
                style={{
                  width: '100%',
                  fontSize: '8px',
                  display: 'flex',
                  flexDirection: 'row',
                  gap: '3px'
                }}
              >
                <Text>Phone No:</Text>
                <Text style={{ fontFamily: 'PopBold' }}>9566996478</Text>
              </View>
              <View
                style={{
                  width: '100%',
                  fontSize: '8px',
                  display: 'flex',
                  flexDirection: 'row',
                  gap: '3px'
                }}
              >
                <Text>Email:</Text>
                <Text style={{ fontFamily: 'PopBold' }}></Text>
              </View>
            </View>
          </View>

          {/* Row-3 */}
          <View
            style={{
              width: '100%',
              height: '120px',
              display: 'flex',
              flexDirection: 'row',
              borderRight: '1px solid #000',
              borderLeft: '1px solid #000'
            }}
          >
            <View
              style={{
                width: '25%',
                height: '120px'
              }}
            >
              <View
                style={{
                  width: '100%',
                  height: '40px',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRight: '1px solid #000',
                  borderBottom: '1px solid #000',
                  padding: '5px',
                  fontSize: '8px'
                }}
              >
                <View
                  style={{
                    width: '100%',
                    fontSize: '7px',
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '3px'
                  }}
                >
                  <Text style={{ fontFamily: 'PopBold' }}>Content Specification:</Text>
                  <Text>CUP</Text>
                </View>
                <View
                  style={{
                    width: '100%',
                    fontSize: '7px',
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '3px'
                  }}
                >
                  <Text style={{ fontFamily: 'PopBold' }}>Paper Enclosed:</Text>
                  <Text></Text>
                </View>
              </View>

              <View
                style={{
                  width: '100%',
                  height: '80px',
                  borderRight: '1px solid #000',
                  borderBottom: '1px solid #000',
                  fontSize: '5px',
                  fontFamily: 'PopRegular',
                  textAlign: 'justify',
                  padding: '5px 5px'
                }}
              >
                <Text style={{ textAlign: 'justify' }}>
                  I/We declare that this consignment does not contain personal mail, cash,
                  jewellery, contraband, illegal drugs, any prohibited items and commodities which
                  can cause safety hazards while transporting
                </Text>
                <Text
                  style={{
                    textAlign: 'center',
                    marginTop: '10px',
                    fontFamily: 'PopBold',
                    textDecoration: 'underline'
                  }}
                >
                  Sende's Signature & Seal
                </Text>
                <Text style={{ textAlign: 'justify', marginTop: '2px' }}>
                  I have read and understood terms & conditions ofcarriage mentioned on website
                  www.dtdc.in, and I agree to the Same.
                </Text>
              </View>
            </View>
            <View
              style={{
                width: '25%',
                height: '120px'
              }}
            >
              <View
                style={{
                  width: '100%',
                  height: '40px',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRight: '1px solid #000',
                  borderBottom: '1px solid #000',
                  fontSize: '8px'
                }}
              >
                <View
                  style={{
                    width: '100%',
                    fontSize: '7px',
                    height: '13px',
                    borderBottom: '1px solid #000',
                    display: 'flex',
                    flexDirection: 'row',
                    paddingLeft: '3px',
                    // justifyContent: "center",
                    alignItems: 'center',
                    gap: '3px'
                  }}
                >
                  <Text>Declared Value:</Text>
                  <Text style={{ fontFamily: 'PopBold' }}>30000</Text>
                </View>
                <View
                  style={{
                    width: '100%',
                    fontSize: '7px',
                    height: '13px',
                    borderBottom: '1px solid #000',
                    display: 'flex',
                    flexDirection: 'row',
                    paddingLeft: '3px',
                    // justifyContent: "center",
                    alignItems: 'center',
                    gap: '3px'
                  }}
                >
                  <Text>No Of Pieces:</Text>
                  <Text style={{ fontFamily: 'PopBold' }}>1</Text>
                </View>
                <View
                  style={{
                    width: '100%',
                    fontSize: '7px',
                    height: '14px',
                    display: 'flex',
                    flexDirection: 'row',
                    paddingLeft: '3px',
                    // justifyContent: "center",
                    alignItems: 'center',
                    gap: '3px'
                  }}
                >
                  <Text>Actual Weight:</Text>
                  <Text style={{ fontFamily: 'PopBold' }}>16.215 Kgs</Text>
                </View>
              </View>
              <View
                style={{
                  width: '100%',
                  height: '26px',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRight: '1px solid #000',
                  borderBottom: '1px solid #000',
                  fontSize: '8px'
                }}
              >
                <View
                  style={{
                    width: '100%',
                    fontSize: '7px',
                    height: '13px',
                    borderBottom: '1px solid #000',
                    display: 'flex',
                    flexDirection: 'row',
                    paddingLeft: '3px',
                    // justifyContent: "center",
                    alignItems: 'center',
                    gap: '3px'
                  }}
                >
                  <Text>Dim:</Text>
                  <Text style={{ fontFamily: 'PopBold' }}>1 cm X 1 cm X 1 cm</Text>
                </View>

                <View
                  style={{
                    width: '100%',
                    fontSize: '7px',
                    height: '13px',
                    display: 'flex',
                    flexDirection: 'row',
                    paddingLeft: '3px',
                    // justifyContent: "center",
                    alignItems: 'center',
                    gap: '3px'
                  }}
                >
                  <Text>Charged weight:</Text>
                  <Text style={{ fontFamily: 'PopBold' }}>16.215 Kgs</Text>
                </View>
              </View>
              <View
                style={{
                  width: '100%',
                  height: '54px',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRight: '1px solid #000',
                  borderBottom: '1px solid #000',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  fontSize: 5
                }}
              >
                <View
                  style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    paddingLeft: '3px',
                    // justifyContent: "center",
                    alignItems: 'center',
                    gap: '3px'
                  }}
                >
                  <Text style={{ fontFamily: 'PopBold' }}>Name:</Text>
                  <Text>SELLAPADI</Text>
                </View>
                <View
                  style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    paddingLeft: 3,
                    // justifyContent: "center",
                    alignItems: 'flex-start'
                    // gap: "3px",
                  }}
                >
                  <Text style={{ width: '18%', fontFamily: 'PopBold' }}>Address:</Text>
                  <Text style={{ width: '75%' }}>
                    Navaladiyar Complex, 26/aarthi Theater Road, VMRP,-,DGL,636307
                  </Text>
                </View>
                <View
                  style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    paddingLeft: '3px',
                    // justifyContent: "center",
                    alignItems: 'center',
                    gap: '3px'
                  }}
                >
                  <Text style={{ fontFamily: 'PopBold' }}>Phone:</Text>
                  <Text>7598057298</Text>
                </View>
              </View>
            </View>
            <View
              style={{
                width: '50%',
                height: '120px'
              }}
            >
              <View
                style={{
                  width: '100%',
                  height: '66px',
                  display: 'flex',
                  flexDirection: 'column',
                  borderBottom: '1px solid #000',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '5px',
                  fontSize: '8px'
                }}
              >
                <Image src={barcode} style={{ width: '80%' }} />
                <View
                  style={{
                    width: '100%',
                    fontSize: '8px',
                    display: 'flex',
                    justifyContent: 'center',
                    // alignItems: "ceter",
                    flexDirection: 'row',
                    gap: '3px',
                    paddingTop: '5px'
                  }}
                >
                  <Text style={{ marginTop: '1px' }}>AWB No:</Text>
                  <Text style={{ fontFamily: 'PopBold' }}>D83049959</Text>
                </View>
              </View>
              <View
                style={{
                  width: '100%',
                  height: '66px',
                  display: 'flex',
                  flexDirection: 'row',
                  borderBottom: '1px solid #000',
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontSize: '8px'
                }}
              >
                <View
                  style={{
                    width: '50%',
                    height: '60px',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRight: '1px solid #000',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontSize: '8px'
                  }}
                >
                  <Text style={{ fontSize: '10px', fontFamily: 'PopBold' }}>Risk Surcharge</Text>
                </View>

                <View
                  style={{
                    width: '50%',
                    height: '60px',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontSize: '8px'
                  }}
                >
                  <View style={{ width: '50%', height: '60px' }}>
                    <View
                      style={{
                        width: '100%',
                        height: '60px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontSize: '8px'
                      }}
                    >
                      <View
                        style={{
                          width: '100%',
                          height: '30px',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderBottom: '1px solid #000',
                          borderRight: '1px solid #000'
                        }}
                      >
                        <Text style={{ fontFamily: 'PopBold' }}>Owner</Text>
                      </View>
                      <View
                        style={{
                          width: '100%',
                          height: '30px',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderRight: '1px solid #000'
                        }}
                      >
                        <Text style={{ fontFamily: 'PopBold' }}>Carrier</Text>
                      </View>
                    </View>
                  </View>
                  <View style={{ width: '50%', height: '60px' }}>
                    <View
                      style={{
                        width: '100%',
                        height: '60px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontSize: '8px'
                      }}
                    >
                      <View
                        style={{
                          width: '100%',
                          height: '30px',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderBottom: '1px solid #000'
                        }}
                      >
                        <Text style={{ fontFamily: 'PopBold' }}></Text>
                      </View>
                      <View
                        style={{
                          width: '100%',
                          height: '30px',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center'
                        }}
                      >
                        <Text style={{ fontFamily: 'PopBold' }}></Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Row-4 */}
          <View
            style={{
              width: '100%',
              height: '20px',
              display: 'flex',
              flexDirection: 'row',
              borderRight: '1px solid #000',
              borderLeft: '1px solid #000',
              borderBottom: '1px solid #000'
            }}
          >
            <View
              style={{
                width: '50%',
                height: '20px',
                borderRight: '1px solid #000',
                fontFamily: 'PopBold',
                fontSize: '7px',
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center',
                flexDirection: 'row'
              }}
            >
              <Text>https:www.dtdc.in</Text>
              <Text>customersupport@dtdc.com</Text>
              <Text>+91-7305770577</Text>
            </View>
            <View
              style={{
                width: '50%',
                height: '20px',
                fontFamily: 'PopBold',
                fontSize: 7,
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
                flexDirection: 'row'
              }}
            >
              <Text style={{ paddingLeft: '5px' }}>Amount collected (in Rs.):</Text>
            </View>
          </View>

          {/* Row-5 */}
          <View
            style={{
              width: '100%',
              height: '15px',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              alignItems: 'center',
              borderRight: '1px solid #000',
              borderLeft: '1px solid #000',
              borderBottom: '1px solid #000'
            }}
          >
            <Text style={{ fontSize: '6px', fontFamily: 'PopBold' }}>
              DOCUMENT IS NOT A TAX INVOICE. WEIGHT CAPTURED BY DTDC WILL BE USED FOR INVOICE
              GENERATION.
            </Text>
            <Text style={{ fontSize: '6px', fontFamily: 'PopBold' }}>Sender's Copy</Text>
          </View>
        </View>
      </Page>
    </Document>
  )
}

export default TestingPDF
