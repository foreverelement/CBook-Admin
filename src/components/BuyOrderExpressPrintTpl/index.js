import React from 'react';
import Barcode from 'react-barcode';
import './index.less'

export default ({ data }) => (
  <div className="print_paper_wrapper">
    <table className="print_paper table_first" height="34">
      <tbody>
        <tr>
          <td style={{padding: 0}}>
            <table className="no_border">
              <tbody>
                <tr>
                  <td style={{verticalAlign: 'middle', padding: 0}} width="113.4" />
                  <td
                    style={{verticalAlign: 'middle'}}
                  />
                  <td
                    style={{
                      verticalAlign: 'middle',
                      textAlign: 'right'
                    }}
                    className="x1"
                  />
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
    <table className="print_paper">
      <tbody>
        <tr>
          <td
            style={{
              padding: 0
            }}
            width="370.5"
            height="56.7"
            className="x4"
          >
            {data.markDestination}
          </td>
        </tr>
      </tbody>
    </table>
    <table className="print_paper" height="37.8">
      <tbody>
        <tr>
          <td className="xx8">{data.packageName}</td>
        </tr>
      </tbody>
    </table>
    <table className="print_paper">
      <tbody>
        <tr>
          <td
            style={{
              padding: 0
            }}
            width="19"
            height="68"
            className="xx15"
          >
            收<br />件
          </td>
          <td width="261" className="xx10">
            <div style={{height: 66, overflow: 'hidden'}}>
              {data.receiverData.name}&nbsp;{data.receiverData.mobile}
              <br />
              {data.receiverData.province} {data.receiverData.city} {data.receiverData.region} {data.receiverData.address}
            </div>
          </td>
          <td className="vt" style={{padding: 0, textAlign: 'left'}} rowSpan="2">
            <div className="wa h30 xx12">服务</div>
            <div className="wa h31">
              付款方式：{data.payType}
              <br />
              计费重量：{data.weight}
            </div>
          </td>
        </tr>
        <tr>
          <td style={{padding: 0}} width="19" height="54" className="xx15">
            寄<br />件
          </td>
          <td width="261" className="xx14">
            <div style={{height: 44, overflow: 'hidden'}}>
              {data.senderData.name}&nbsp;{data.senderData.mobile}
              <br />
              {data.senderData.province} {data.senderData.city} {data.senderData.region} {data.senderData.address}
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <table className="print_paper" height="94.5">
      <tbody>
        <tr>
          <td style={{textAlign: 'center', padding: 0}}>
            <Barcode font="Arial" fontSize={16} height={40} margin={0} value={data.logisticCode} />
          </td>
        </tr>
      </tbody>
    </table>
    <table className="print_paper">
      <tbody>
        <tr>
          <td width="238" style={{padding: 0}} className="xx16" height="70">
            <div className="guge">快件送达收件人地址，经收件人或收件人（寄件人）允许的代收人签字，视为送达。您的签字代表您已验收此包裹，并已确认商品信息无误、包装完好、没有划痕、破损等表面质量问题。
            </div>
          </td>
          <td width="132.3" className="xx17" height="71.8">
            签收人：
            <br />
            <br />
            时间:
          </td>
        </tr>
      </tbody>
    </table>
    <table className="print_paper table_first">
      <tbody>
        <tr>
          <td style={{padding: 0}}>
            <table className="no_border">
              <tbody>
              <tr>
                <td style={{verticalAlign: 'middle', padding: 0}} width="113.4" height="55">
                </td>
                <td style={{verticalAlign: 'middle', padding: 0}} height="55">&nbsp;</td>
                <td style={{verticalAlign: 'middle', padding: 0, textAlign: 'center'}} height="55" width="257">
                  <Barcode font="Arial" fontSize={14} width={1.2} margin={0} height={22} value={data.logisticCode} />
                </td>
              </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
    <table className="print_paper ">
      <tbody>
        <tr>
          <td style={{padding: 0}} width="20" height="45" className="xx15">
            收件
          </td>
          <td width="342" height="45.5" className="xx14">
            <div style={{height: 44, overflow: 'hidden'}}>
              {data.receiverData.name}&nbsp;{data.receiverData.mobile}
              <br />
              {data.receiverData.province} {data.receiverData.city} {data.receiverData.region} {data.receiverData.address}
            </div>
          </td>
        </tr>
        <tr>
          <td style={{padding: 0}} width="20" height="45" className="xx15">
            寄件
          </td>
          <td width="342" height="45.5" className="xx14">
            <div style={{height: 44, overflow: 'hidden'}}>
              {data.senderData.name}&nbsp;{data.senderData.mobile}
              <br />
              {data.senderData.province} {data.senderData.city} {data.senderData.region} {data.senderData.address}
            </div>
          </td>
        </tr>
        <tr>
          <td height="105" colSpan="2" style={{padding: 0}}>
            <table className="no_border">
              <tbody>
                <tr>
                  <td height="90%" width="370" className="xx10">
                    <div className="f8" style={{fontWeight: 'normal'}}>
                      数量：{data.quantity}&nbsp;&nbsp;重量：{data.weight}&nbsp;&nbsp;星月童书书本回收
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style={{padding: 0}} width="370" className="xx18">已检视</td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
);
