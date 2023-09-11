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
//A:Reactにはクラスコンポーネントと関数コンポーネントというものがあり、今回関数コンポーネントで書かれていたためclassからfunctionに変更をし対応した。
//　そもそもクラスコンポーネントと関数コンポーネントでは書き方が違っているため、下記サイトを参照し確認する事。
//クラスコンポーネント：Reactの古典的な方法でjsのクラスを使って定義される。render()メソッドを用いてUIを返す。stateやlifecycleメソッドを利用することが可能。
//関数コンポーネント：シンプルで簡潔な構文でコンポーネントを定義する。通常はアロー関数を使って定義される。stateやlifecycleメソッドを利用しない代わりにReactHooksを使って同様の機能を使える。
//参考サイト：https://qiita.com/omo_taku/items/18da0c020672a368f166
  const [zipcode, setZipcodeMain] = useState<Zipcode>({
    main: "",
    sub: ""
  });
  //zipcodeは状態変数で現在の郵便番号のデータを保持する。
  //setZipcodeMain は、この状態変数を更新するための関数。setZipcodeMain を呼び出すことで、zipcode の値を変更できる。
  //main: "",sub: ""はzipcodeの初期値として扱う。""を使って初期化されている。
  const [address, setAddress] = useState<Address>({
    address1: "",
    address2: "",
    address3: ""
  });
  //addressは状態変数で現在の住所のデータを保持する。
  //setAddressは、この状態変数を更新するための関数。setAddressを呼び出すことで、address の値を変更できる。
  //address1: "",address2: "",address3: ""はaddressの初期値として扱う。""を使って初期化されている。

  const updateZipcodeMain = (e: ChangeEvent<HTMLInputElement>) => {
    setZipcodeMain({ ...zipcode, main: e.target.value });
  };
  //...:スプレッド構文【反復可能な要素や関数呼び出しに展開することができる構文】
  const updateZipcodeSub = async (e: ChangeEvent<HTMLInputElement>) => {
    setZipcodeMain({ ...zipcode, sub: e.target.value });
      //...:スプレッド構文【反復可能な要素や関数呼び出しに展開することができる構文】
    if (e.target.value.length === 4 && zipcode.main.length === 3) {
      //右側に4文字入力できている、かつ左側に3文字入力できている場合→tryが実行される。
      //try catchはワンセット。API関係などではほぼ使われる。tryで実行できないと判断されたものはcatchの実行へと移る。
      //if elseだけではダメなのか？→APIはいつ更新されるか分からないエラーの宝庫のため、例外処理(try)を行っておく方がいい。
      try {
        const res = await axios.get(
          "https://zipcloud.ibsnet.co.jp/api/search",
          {
            params: {
              zipcode: zipcode.main + e.target.value
            }
          }
        );
        //上記URLより、入力された7桁に完全一致するもののデータを抽出する(get)
        if (res.data.results) {
          const result = res.data.results[0];
          setAddress({
            ...address,
            address1: result["address1"],
            address2: result["address2"],
            address3: result["address3"]
          });
        }
        //抽出されたデータをそれぞれの項目へと配置する。(配列使用)
      } catch {
        alert("住所の取得に失敗しました。");
      }
      //tryの処理が行われない場合はこちらが動作する。
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

