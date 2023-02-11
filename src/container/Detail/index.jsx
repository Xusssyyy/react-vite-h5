import React, { useState, useEffect, useRef } from "react";
import Header from "@/components/Header";
import CustomIcon from "@/components/CustomIcon";
import s from "./style.module.less";
import { useNavigate, useSearchParams } from "react-router-dom";
import { get, typeMap, post } from "@/utils";
import dayjs from "dayjs";
import cx from "classnames";
import { Modal, Toast } from "zarm";
import PopupAddBill from "@/components/PopupAddBill";

const Detail = () => {
  const [param] = useSearchParams(); //匹配url路径的id值
  const navigateTo = useNavigate();
  const [detail, setDetail] = useState({});
  const id = param.get("id");
  const editRef = useRef();

  useEffect(() => {
    getDetail();
    console.log(id, "////");
  }, []);

  const getDetail = async () => {
    const { data } = await get(`/api/bill/detail?id=${id}`);
    setDetail(data);
    console.log(data, "data");
  };

  // 删除方法
  const deleteDetail = () => {
    Modal.confirm({
      title: "删除",
      content: "确认删除账单？",
      onOk: async () => {
        const { data } = await post("/api/bill/delete", { id });
        console.log(data, "123");
        Toast.show("删除成功");
        navigateTo(-1);
      },
    });
  };

  return (
    <div className={s.detail}>
      <Header title="账单详情" />
      <div className={s.card}>
        <div className={s.type}>
          {/* 通过 pay_type 属性，判断是收入或指出，给出不同的颜色*/}
          <span
            className={cx({
              [s.expense]: detail.pay_type == 1,
              [s.income]: detail.pay_type == 2,
            })}
          >
            {/* typeMap 是我们事先约定好的 icon 列表 */}
            <CustomIcon
              className={s.iconfont}
              type={detail.type_id ? typeMap[detail.type_id].icon : 1}
            />
          </span>
          <span>{detail.type_name || ""}</span>
        </div>
        {detail.pay_type == 1 ? (
          <div className={cx(s.amount, s.expense)}>-{detail.amount}</div>
        ) : (
          <div className={cx(s.amount, s.income)}>+{detail.amount}</div>
        )}
        <div className={s.info}>
          <div className={s.time}>
            <span>记录时间</span>
            <span>{dayjs(Number(detail.date)).format("YYYY-MM-DD HH:mm")}</span>
          </div>
          <div className={s.remark}>
            <span>备注</span>
            <span>{detail.remark || "-"}</span>
          </div>
        </div>
        <div className={s.operation}>
          <span onClick={deleteDetail}>
            <CustomIcon type="shanchu" />
            删除
          </span>
          <span onClick={() => editRef.current && editRef.current.show()}>
            <CustomIcon type="tianjia" />
            编辑
          </span>
        </div>
      </div>
      <PopupAddBill ref={editRef} detail={detail} onReload={getDetail} />
    </div>
  );
};

export default Detail;
