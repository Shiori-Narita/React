//component(部品)を作成する際には、今回であればsrcフォルダ内に新たにcomponentフォルダを作成しそのなかで作成する。
//git連携する際には必ずブランチを確認する。(mainやdefaultなど大元のブランチで作業することは絶対に禁止)
//タイプスクリプトの場合の拡張子はtsx

import React from "react";
//Reactアプリケーション無いでReactライブラリを使用するためにインポートする。
import '../App.css';
//App.cssの場所に併せる必要があるため".."を使用している。※同じフォルダ内の場合は一つでいい。
import axios from "axios";
//axiosという名前で外部ライブラリをインポートしている。
import { ChangeEvent, useState } from "react";
//"react"というモジュール(機能・要素)から"ChangeEvent" "useState"という名前の2つをインポートしている。

type Zipcode = {
  main: string;
  sub: string;
};
//type：tsで新しい型を定義するために使用される。
//今回はZipcodeという型を定義する。
//mainは文字列型で郵便番号の主要な部分を表す。　subは文字列型で郵便番号のサブ部分を表す。
//例：北海道札幌市北区篠路5条(002-8025)の場合
//main：002　sub：8025
type Address = {
  address1: string;
  address2: string;
  address3: string;
};
//type：tsで新しい型を定義するために使用される。
//今回はAddressという型を定義する。
//address1は文字列型で都道府県を表す。address2は市区町村。address3は町域。
//例：北海道札幌市北区篠路5条(002-8025)の場合
//address1：北海道
//address2：札幌市北区
//address3：篠路五条



export default function Formtext() {
//export default：jsまたはtsのモジュールファイル内でデフォルトのエクスポートを行うための関数宣言。
//モジュール内から1つだけエクスポートすることが可能で、他のモジュールからこのモジュールをインポートした場合デフォルトエクスポートが自動的に割り当てられる。
//今回はFormtextという関数を宣言している。以下が関数の内容である。
//Q：今回classではなくfunctionにした理由は何？(日報の質問事項にて質問済み)
  const [zipcode, setZipcodeMain] = useState<Zipcode>({
    main: "",
    sub: ""
  });
  const [address, setAddress] = useState<Address>({
    address1: "",
    address2: "",
    address3: ""
  });

  const updateZipcodeMain = (e: ChangeEvent<HTMLInputElement>) => {
    setZipcodeMain({ ...zipcode, main: e.target.value });
  };
  const updateZipcodeSub = async (e: ChangeEvent<HTMLInputElement>) => {
    setZipcodeMain({ ...zipcode, sub: e.target.value });
    if (e.target.value.length === 4 && zipcode.main.length === 3) {
      try {
        const res = await axios.get(
          "https://zipcloud.ibsnet.co.jp/api/search",
          {
            params: {
              zipcode: zipcode.main + e.target.value
            }
          }
        );
        if (res.data.results) {
          const result = res.data.results[0];
          setAddress({
            ...address,
            address1: result["address1"],
            address2: result["address2"],
            address3: result["address3"]
          });
        }
      } catch {
        alert("住所の取得に失敗しました。");
      }
    }
  };
        return (
          <div>
          <h2>郵便番号から住所の住所の自動入力</h2>
          <div>
            <span>郵便番号：</span>
            <input type="text" onChange={updateZipcodeMain} value={zipcode.main} />
            <span> - </span>
            <input type="text" onChange={updateZipcodeSub} value={zipcode.sub} />
          </div>
          <div>
            <p>自動入力される住所</p>
            <div>
              <p>都道府県： {address.address1}</p>
              <p>市区町村： {address.address2}</p>
              <p>町域： {address.address3}</p>
            </div>
          </div>
        </div>
          );
    }

