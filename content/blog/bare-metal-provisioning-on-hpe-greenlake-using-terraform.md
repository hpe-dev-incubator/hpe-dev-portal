---
title: Bare Metal provisioning on HPE GreenLake using Terraform
date: 2023-02-26T19:38:34.667Z
author: Chaita Mylarappachar
authorimage: /img/chaitra_mylarappachar.png
disable: false
---
<!--\[if !mso]>
<style>
v\:* {behavior:url(#default#VML);}
o\:* {behavior:url(#default#VML);}
w\:* {behavior:url(#default#VML);}
.shape {behavior:url(#default#VML);}
</style>
<!\[endif]-->

<!--\[if gte mso 9]><xml>
 <o:OfficeDocumentSettings>
  <o:AllowPNG/>
 </o:OfficeDocumentSettings>
</xml><!\[endif]-->

<!--\[if gte mso 9]><xml>
 <w:WordDocument>
  <w:View>Normal</w:View>
  <w:Zoom>0</w:Zoom>
  <w:TrackMoves>false</w:TrackMoves>
  <w:TrackFormatting/>
  <w:PunctuationKerning/>
  <w:ValidateAgainstSchemas/>
  <w:SaveIfXMLInvalid>false</w:SaveIfXMLInvalid>
  <w:IgnoreMixedContent>false</w:IgnoreMixedContent>
  <w:AlwaysShowPlaceholderText>false</w:AlwaysShowPlaceholderText>
  <w:DoNotPromoteQF/>
  <w:LidThemeOther>EN-US</w:LidThemeOther>
  <w:LidThemeAsian>X-NONE</w:LidThemeAsian>
  <w:LidThemeComplexScript>X-NONE</w:LidThemeComplexScript>
  <w:Compatibility>
   <w:BreakWrappedTables/>
   <w:SnapToGridInCell/>
   <w:WrapTextWithPunct/>
   <w:UseAsianBreakRules/>
   <w:DontGrowAutofit/>
   <w:SplitPgBreakAndParaMark/>
   <w:EnableOpenTypeKerning/>
   <w:DontFlipMirrorIndents/>
   <w:OverrideTableStyleHps/>
  </w:Compatibility>
  <m:mathPr>
   <m:mathFont m:val="Cambria Math"/>
   <m:brkBin m:val="before"/>
   <m:brkBinSub m:val="&#45;-"/>
   <m:smallFrac m:val="off"/>
   <m:dispDef/>
   <m:lMargin m:val="0"/>
   <m:rMargin m:val="0"/>
   <m:defJc m:val="centerGroup"/>
   <m:wrapIndent m:val="1440"/>
   <m:intLim m:val="subSup"/>
   <m:naryLim m:val="undOvr"/>
  </m:mathPr></w:WordDocument>
</xml><!\[endif]-->

<!--\[if gte mso 9]><xml>
 <w:LatentStyles DefLockedState="false" DefUnhideWhenUsed="false"
  DefSemiHidden="false" DefQFormat="false" DefPriority="99"
  LatentStyleCount="371">
  <w:LsdException Locked="false" Priority="0" QFormat="true" Name="Normal"/>
  <w:LsdException Locked="false" Priority="9" QFormat="true" Name="heading 1"/>
  <w:LsdException Locked="false" Priority="9" SemiHidden="true"
   UnhideWhenUsed="true" QFormat="true" Name="heading 2"/>
  <w:LsdException Locked="false" Priority="9" SemiHidden="true"
   UnhideWhenUsed="true" QFormat="true" Name="heading 3"/>
  <w:LsdException Locked="false" Priority="9" SemiHidden="true"
   UnhideWhenUsed="true" QFormat="true" Name="heading 4"/>
  <w:LsdException Locked="false" Priority="9" SemiHidden="true"
   UnhideWhenUsed="true" QFormat="true" Name="heading 5"/>
  <w:LsdException Locked="false" Priority="9" SemiHidden="true"
   UnhideWhenUsed="true" QFormat="true" Name="heading 6"/>
  <w:LsdException Locked="false" Priority="9" SemiHidden="true"
   UnhideWhenUsed="true" QFormat="true" Name="heading 7"/>
  <w:LsdException Locked="false" Priority="9" SemiHidden="true"
   UnhideWhenUsed="true" QFormat="true" Name="heading 8"/>
  <w:LsdException Locked="false" Priority="9" SemiHidden="true"
   UnhideWhenUsed="true" QFormat="true" Name="heading 9"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="index 1"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="index 2"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="index 3"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="index 4"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="index 5"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="index 6"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="index 7"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="index 8"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="index 9"/>
  <w:LsdException Locked="false" Priority="39" SemiHidden="true"
   UnhideWhenUsed="true" Name="toc 1"/>
  <w:LsdException Locked="false" Priority="39" SemiHidden="true"
   UnhideWhenUsed="true" Name="toc 2"/>
  <w:LsdException Locked="false" Priority="39" SemiHidden="true"
   UnhideWhenUsed="true" Name="toc 3"/>
  <w:LsdException Locked="false" Priority="39" SemiHidden="true"
   UnhideWhenUsed="true" Name="toc 4"/>
  <w:LsdException Locked="false" Priority="39" SemiHidden="true"
   UnhideWhenUsed="true" Name="toc 5"/>
  <w:LsdException Locked="false" Priority="39" SemiHidden="true"
   UnhideWhenUsed="true" Name="toc 6"/>
  <w:LsdException Locked="false" Priority="39" SemiHidden="true"
   UnhideWhenUsed="true" Name="toc 7"/>
  <w:LsdException Locked="false" Priority="39" SemiHidden="true"
   UnhideWhenUsed="true" Name="toc 8"/>
  <w:LsdException Locked="false" Priority="39" SemiHidden="true"
   UnhideWhenUsed="true" Name="toc 9"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Normal Indent"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="footnote text"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="annotation text"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="header"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="footer"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="index heading"/>
  <w:LsdException Locked="false" Priority="35" SemiHidden="true"
   UnhideWhenUsed="true" QFormat="true" Name="caption"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="table of figures"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="envelope address"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="envelope return"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="footnote reference"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="annotation reference"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="line number"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="page number"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="endnote reference"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="endnote text"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="table of authorities"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="macro"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="toa heading"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="List"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="List Bullet"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="List Number"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="List 2"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="List 3"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="List 4"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="List 5"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="List Bullet 2"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="List Bullet 3"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="List Bullet 4"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="List Bullet 5"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="List Number 2"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="List Number 3"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="List Number 4"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="List Number 5"/>
  <w:LsdException Locked="false" Priority="10" QFormat="true" Name="Title"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Closing"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Signature"/>
  <w:LsdException Locked="false" Priority="1" SemiHidden="true"
   UnhideWhenUsed="true" Name="Default Paragraph Font"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Body Text"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Body Text Indent"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="List Continue"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="List Continue 2"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="List Continue 3"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="List Continue 4"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="List Continue 5"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Message Header"/>
  <w:LsdException Locked="false" Priority="11" QFormat="true" Name="Subtitle"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Salutation"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Date"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Body Text First Indent"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Body Text First Indent 2"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Note Heading"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Body Text 2"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Body Text 3"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Body Text Indent 2"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Body Text Indent 3"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Block Text"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Hyperlink"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="FollowedHyperlink"/>
  <w:LsdException Locked="false" Priority="22" QFormat="true" Name="Strong"/>
  <w:LsdException Locked="false" Priority="20" QFormat="true" Name="Emphasis"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Document Map"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Plain Text"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="E-mail Signature"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="HTML Top of Form"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="HTML Bottom of Form"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Normal (Web)"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="HTML Acronym"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="HTML Address"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="HTML Cite"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="HTML Code"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="HTML Definition"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="HTML Keyboard"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="HTML Preformatted"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="HTML Sample"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="HTML Typewriter"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="HTML Variable"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Normal Table"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="annotation subject"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="No List"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Outline List 1"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Outline List 2"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Outline List 3"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Simple 1"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Simple 2"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Simple 3"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Classic 1"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Classic 2"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Classic 3"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Classic 4"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Colorful 1"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Colorful 2"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Colorful 3"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Columns 1"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Columns 2"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Columns 3"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Columns 4"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Columns 5"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Grid 1"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Grid 2"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Grid 3"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Grid 4"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Grid 5"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Grid 6"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Grid 7"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Grid 8"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table List 1"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table List 2"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table List 3"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table List 4"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table List 5"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table List 6"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table List 7"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table List 8"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table 3D effects 1"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table 3D effects 2"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table 3D effects 3"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Contemporary"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Elegant"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Professional"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Subtle 1"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Subtle 2"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Web 1"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Web 2"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Web 3"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Balloon Text"/>
  <w:LsdException Locked="false" Priority="39" Name="Table Grid"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Theme"/>
  <w:LsdException Locked="false" SemiHidden="true" Name="Placeholder Text"/>
  <w:LsdException Locked="false" Priority="1" QFormat="true" Name="No Spacing"/>
  <w:LsdException Locked="false" Priority="60" Name="Light Shading"/>
  <w:LsdException Locked="false" Priority="61" Name="Light List"/>
  <w:LsdException Locked="false" Priority="62" Name="Light Grid"/>
  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1"/>
  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2"/>
  <w:LsdException Locked="false" Priority="65" Name="Medium List 1"/>
  <w:LsdException Locked="false" Priority="66" Name="Medium List 2"/>
  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1"/>
  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2"/>
  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3"/>
  <w:LsdException Locked="false" Priority="70" Name="Dark List"/>
  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading"/>
  <w:LsdException Locked="false" Priority="72" Name="Colorful List"/>
  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid"/>
  <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 1"/>
  <w:LsdException Locked="false" Priority="61" Name="Light List Accent 1"/>
  <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 1"/>
  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 1"/>
  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 1"/>
  <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 1"/>
  <w:LsdException Locked="false" SemiHidden="true" Name="Revision"/>
  <w:LsdException Locked="false" Priority="34" QFormat="true"
   Name="List Paragraph"/>
  <w:LsdException Locked="false" Priority="29" QFormat="true" Name="Quote"/>
  <w:LsdException Locked="false" Priority="30" QFormat="true"
   Name="Intense Quote"/>
  <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 1"/>
  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 1"/>
  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 1"/>
  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 1"/>
  <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 1"/>
  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 1"/>
  <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 1"/>
  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 1"/>
  <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 2"/>
  <w:LsdException Locked="false" Priority="61" Name="Light List Accent 2"/>
  <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 2"/>
  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 2"/>
  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 2"/>
  <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 2"/>
  <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 2"/>
  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 2"/>
  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 2"/>
  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 2"/>
  <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 2"/>
  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 2"/>
  <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 2"/>
  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 2"/>
  <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 3"/>
  <w:LsdException Locked="false" Priority="61" Name="Light List Accent 3"/>
  <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 3"/>
  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 3"/>
  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 3"/>
  <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 3"/>
  <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 3"/>
  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 3"/>
  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 3"/>
  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 3"/>
  <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 3"/>
  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 3"/>
  <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 3"/>
  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 3"/>
  <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 4"/>
  <w:LsdException Locked="false" Priority="61" Name="Light List Accent 4"/>
  <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 4"/>
  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 4"/>
  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 4"/>
  <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 4"/>
  <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 4"/>
  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 4"/>
  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 4"/>
  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 4"/>
  <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 4"/>
  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 4"/>
  <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 4"/>
  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 4"/>
  <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 5"/>
  <w:LsdException Locked="false" Priority="61" Name="Light List Accent 5"/>
  <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 5"/>
  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 5"/>
  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 5"/>
  <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 5"/>
  <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 5"/>
  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 5"/>
  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 5"/>
  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 5"/>
  <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 5"/>
  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 5"/>
  <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 5"/>
  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 5"/>
  <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 6"/>
  <w:LsdException Locked="false" Priority="61" Name="Light List Accent 6"/>
  <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 6"/>
  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 6"/>
  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 6"/>
  <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 6"/>
  <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 6"/>
  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 6"/>
  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 6"/>
  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 6"/>
  <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 6"/>
  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 6"/>
  <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 6"/>
  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 6"/>
  <w:LsdException Locked="false" Priority="19" QFormat="true"
   Name="Subtle Emphasis"/>
  <w:LsdException Locked="false" Priority="21" QFormat="true"
   Name="Intense Emphasis"/>
  <w:LsdException Locked="false" Priority="31" QFormat="true"
   Name="Subtle Reference"/>
  <w:LsdException Locked="false" Priority="32" QFormat="true"
   Name="Intense Reference"/>
  <w:LsdException Locked="false" Priority="33" QFormat="true" Name="Book Title"/>
  <w:LsdException Locked="false" Priority="37" SemiHidden="true"
   UnhideWhenUsed="true" Name="Bibliography"/>
  <w:LsdException Locked="false" Priority="39" SemiHidden="true"
   UnhideWhenUsed="true" QFormat="true" Name="TOC Heading"/>
  <w:LsdException Locked="false" Priority="41" Name="Plain Table 1"/>
  <w:LsdException Locked="false" Priority="42" Name="Plain Table 2"/>
  <w:LsdException Locked="false" Priority="43" Name="Plain Table 3"/>
  <w:LsdException Locked="false" Priority="44" Name="Plain Table 4"/>
  <w:LsdException Locked="false" Priority="45" Name="Plain Table 5"/>
  <w:LsdException Locked="false" Priority="40" Name="Grid Table Light"/>
  <w:LsdException Locked="false" Priority="46" Name="Grid Table 1 Light"/>
  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2"/>
  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3"/>
  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4"/>
  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark"/>
  <w:LsdException Locked="false" Priority="51" Name="Grid Table 6 Colorful"/>
  <w:LsdException Locked="false" Priority="52" Name="Grid Table 7 Colorful"/>
  <w:LsdException Locked="false" Priority="46"
   Name="Grid Table 1 Light Accent 1"/>
  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 1"/>
  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 1"/>
  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 1"/>
  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 1"/>
  <w:LsdException Locked="false" Priority="51"
   Name="Grid Table 6 Colorful Accent 1"/>
  <w:LsdException Locked="false" Priority="52"
   Name="Grid Table 7 Colorful Accent 1"/>
  <w:LsdException Locked="false" Priority="46"
   Name="Grid Table 1 Light Accent 2"/>
  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 2"/>
  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 2"/>
  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 2"/>
  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 2"/>
  <w:LsdException Locked="false" Priority="51"
   Name="Grid Table 6 Colorful Accent 2"/>
  <w:LsdException Locked="false" Priority="52"
   Name="Grid Table 7 Colorful Accent 2"/>
  <w:LsdException Locked="false" Priority="46"
   Name="Grid Table 1 Light Accent 3"/>
  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 3"/>
  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 3"/>
  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 3"/>
  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 3"/>
  <w:LsdException Locked="false" Priority="51"
   Name="Grid Table 6 Colorful Accent 3"/>
  <w:LsdException Locked="false" Priority="52"
   Name="Grid Table 7 Colorful Accent 3"/>
  <w:LsdException Locked="false" Priority="46"
   Name="Grid Table 1 Light Accent 4"/>
  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 4"/>
  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 4"/>
  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 4"/>
  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 4"/>
  <w:LsdException Locked="false" Priority="51"
   Name="Grid Table 6 Colorful Accent 4"/>
  <w:LsdException Locked="false" Priority="52"
   Name="Grid Table 7 Colorful Accent 4"/>
  <w:LsdException Locked="false" Priority="46"
   Name="Grid Table 1 Light Accent 5"/>
  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 5"/>
  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 5"/>
  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 5"/>
  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 5"/>
  <w:LsdException Locked="false" Priority="51"
   Name="Grid Table 6 Colorful Accent 5"/>
  <w:LsdException Locked="false" Priority="52"
   Name="Grid Table 7 Colorful Accent 5"/>
  <w:LsdException Locked="false" Priority="46"
   Name="Grid Table 1 Light Accent 6"/>
  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 6"/>
  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 6"/>
  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 6"/>
  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 6"/>
  <w:LsdException Locked="false" Priority="51"
   Name="Grid Table 6 Colorful Accent 6"/>
  <w:LsdException Locked="false" Priority="52"
   Name="Grid Table 7 Colorful Accent 6"/>
  <w:LsdException Locked="false" Priority="46" Name="List Table 1 Light"/>
  <w:LsdException Locked="false" Priority="47" Name="List Table 2"/>
  <w:LsdException Locked="false" Priority="48" Name="List Table 3"/>
  <w:LsdException Locked="false" Priority="49" Name="List Table 4"/>
  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark"/>
  <w:LsdException Locked="false" Priority="51" Name="List Table 6 Colorful"/>
  <w:LsdException Locked="false" Priority="52" Name="List Table 7 Colorful"/>
  <w:LsdException Locked="false" Priority="46"
   Name="List Table 1 Light Accent 1"/>
  <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 1"/>
  <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 1"/>
  <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 1"/>
  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 1"/>
  <w:LsdException Locked="false" Priority="51"
   Name="List Table 6 Colorful Accent 1"/>
  <w:LsdException Locked="false" Priority="52"
   Name="List Table 7 Colorful Accent 1"/>
  <w:LsdException Locked="false" Priority="46"
   Name="List Table 1 Light Accent 2"/>
  <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 2"/>
  <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 2"/>
  <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 2"/>
  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 2"/>
  <w:LsdException Locked="false" Priority="51"
   Name="List Table 6 Colorful Accent 2"/>
  <w:LsdException Locked="false" Priority="52"
   Name="List Table 7 Colorful Accent 2"/>
  <w:LsdException Locked="false" Priority="46"
   Name="List Table 1 Light Accent 3"/>
  <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 3"/>
  <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 3"/>
  <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 3"/>
  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 3"/>
  <w:LsdException Locked="false" Priority="51"
   Name="List Table 6 Colorful Accent 3"/>
  <w:LsdException Locked="false" Priority="52"
   Name="List Table 7 Colorful Accent 3"/>
  <w:LsdException Locked="false" Priority="46"
   Name="List Table 1 Light Accent 4"/>
  <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 4"/>
  <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 4"/>
  <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 4"/>
  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 4"/>
  <w:LsdException Locked="false" Priority="51"
   Name="List Table 6 Colorful Accent 4"/>
  <w:LsdException Locked="false" Priority="52"
   Name="List Table 7 Colorful Accent 4"/>
  <w:LsdException Locked="false" Priority="46"
   Name="List Table 1 Light Accent 5"/>
  <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 5"/>
  <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 5"/>
  <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 5"/>
  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 5"/>
  <w:LsdException Locked="false" Priority="51"
   Name="List Table 6 Colorful Accent 5"/>
  <w:LsdException Locked="false" Priority="52"
   Name="List Table 7 Colorful Accent 5"/>
  <w:LsdException Locked="false" Priority="46"
   Name="List Table 1 Light Accent 6"/>
  <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 6"/>
  <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 6"/>
  <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 6"/>
  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 6"/>
  <w:LsdException Locked="false" Priority="51"
   Name="List Table 6 Colorful Accent 6"/>
  <w:LsdException Locked="false" Priority="52"
   Name="List Table 7 Colorful Accent 6"/>
 </w:LatentStyles>
</xml><!\[endif]-->

<!--\[if gte mso 10]>
<style>
 /* Style Definitions */
 table.MsoNormalTable
	{mso-style-name:"Table Normal";
	mso-tstyle-rowband-size:0;
	mso-tstyle-colband-size:0;
	mso-style-noshow:yes;
	mso-style-priority:99;
	mso-style-parent:"";
	mso-padding-alt:0in 5.4pt 0in 5.4pt;
	mso-para-margin-top:0in;
	mso-para-margin-right:0in;
	mso-para-margin-bottom:8.0pt;
	mso-para-margin-left:0in;
	line-height:107%;
	mso-pagination:widow-orphan;
	font-size:11.0pt;
	font-family:"Calibri",sans-serif;
	mso-ascii-font-family:Calibri;
	mso-ascii-theme-font:minor-latin;
	mso-hansi-font-family:Calibri;
	mso-hansi-theme-font:minor-latin;
	mso-bidi-font-family:"Times New Roman";
	mso-bidi-theme-font:minor-bidi;}
</style>
<!\[endif]-->

<!--StartFragment-->

# Introduction

The HPE GreenLake for Private Cloud Enterprise: bare metal (BMaaS) service offering enables you to create a dedicated compute instances deployed on a physical IT infrastructure facilitating on-demand scalability, convenience, and agility as a cloud service.

Using BMaaS, you can create compute-instances provisioned with specific operating systems, network connections, one or more public SSH keys, and optional network-attached storage volumes.

The service can be accessed via GUI as well as via public APIs, enabling developers to use an Infrastructure-as-Code tool to build, change, and manage infrastructure in a consistent and repeatable way.

 

## HPE GreenLake Terraform Provider

The HPE GreenLake Terraform provider **hpegl** by HPE GreenLake provides Infrastructure-as-Code support for HPE GreenLake Cloud Services.

Using the **hpegl** Terraform provider you can automate the management of your infrastructure. You can provision OS on bare metal, spin Virtual Machines and bring up a Kubernetes cluster starting\
right from bare metal all the way up in the stack to desired configurations and applications.

 

In this blog post, I will walk you through the steps required to use the HPE GreenLake Terraform Provider to deploy and further manage bare metal compute instances.

 

# Preparing for Infrastructure-as-Code implementation

Terraform Installation\
Your first step is to get your system ready to run Terraform. In case this has not been done yet:

1. Download and install Terraform, version v0.13 or later.\
   For more information, see https://learn.hashicorp.com/tutorials/terraform/install-cli.
2. Verify the installation with terraform –help\
   At this point, you are ready to start building your infrastructure description file.  

## Setting up API Client for access

## You need an API client to authenticate against HPE GreenLake.  Follow the below steps for API Client creation:

1. From the HPE GreenLake platform, launch the HPE GreenLake Central console for the appropriate tenant. Under the settings icon on the tenant Dashboard page, select User Management option.

   ![](file:///C:\Users\mylarapc\AppData\Local\Temp\msohtmlclip1\01\clip_image002.jpg)

 

2. Under the API Clients tab, click on Create API Client.

   ![](file:///C:\Users\mylarapc\AppData\Local\Temp\msohtmlclip1\01\clip_image004.jpg)

 

3. Enter a **Name** (mandatory field) and **Description** (optional) for the API client, and click on **Create** button.

   ![https://developer.hpe.com/img/3.png](file:///C:\Users\mylarapc\AppData\Local\Temp\msohtmlclip1\01\clip_image006.png)




4. Ensure you make a note of the Issuer, Client ID and Client Secret before clicking on the Close button.\
    \
   These details will be exported as environment variables in the next section.

   ![](file:///C:\Users\mylarapc\AppData\Local\Temp\msohtmlclip1\01\clip_image008.jpg)




5. In the API Clients page, select the newly created client, and click on **Create Assignmen**t button.


6. Assign the roles **BMAAS Access Viewer** and **BMAAS Access Project Contributo**r on the **Space: Default**.

   ![](file:///C:\Users\mylarapc\AppData\Local\Temp\msohtmlclip1\01\clip_image010.jpg)

   \
   \
   \
   The API Client is now ready to be used to run the Terraform resources.

## Select the Compute Group ID

Compute Group is a logical grouping of bare metal resources that a team of Cloud Consumers can consume. You must specify the compute-group ID to interact with bare metal resources.

 

Note: Compute Group is AKA Project.

 

You can get the compute group ID from HPE GreenLake Console.

 

1. Navigate to HPE GreenLake for Private Cloud Services card -> Bare Metal -> Compute Groups.

   ![](file:///C:\Users\mylarapc\AppData\Local\Temp\msohtmlclip1\01\clip_image012.jpg)

 

2. Click on the desired compute group and extract the ID from the browser URL seen at that time.\
   \
   This will later be exported as environment variable **HPE_METAL_PROJECT_ID** in the later section.

 

<!--\[if gte vml 1]><v:shape
 id="Picture_x0020_26" o:spid="_x0000_i1032" type="#_x0000_t75" style='width:790pt;
 height:259pt;visibility:visible;mso-wrap-style:square'>
 <v:imagedata src="file:///C:\Users\mylarapc\AppData\Local\Temp\msohtmlclip1\01\clip_image013.png"
  o:title=""/>
</v:shape><!\[endif]--><!--\[if !vml]-->![](file:///C:\Users\mylarapc\AppData\Local\Temp\msohtmlclip1\01\clip_image014.jpg)<!--\[endif]-->

# Deploy Compute Instance

## Select Terraform provider with bare metal service configurations

<!--\[if !supportLists]-->1.     <!--\[endif]-->**Export the following environment variables on your setup.**\
Export the Tenant ID:

\`\``bash\
export HPEGL_TENANT_ID="<Tenant ID>

\`\``

\
Export the API Client credentials that you obtained when you create an API Client within HPE GreenLake Central:\
\
\`\``bash

export HPEGL_USER_ID="<API Client ID>"

export HPEGL_USER_SECRET="<API Client Secret>"

export HPEGL_IAM_SERVICE_URL="<Issuer URL>"

\`\``

 

\
\
Export the Compute Group ID:\
<!--\[if !supportLineBreakNewLine]-->\
<!--\[endif]-->

\`\``bash

\# compute group/project ID

export HPEGL_METAL_PROJECT_ID="<Compute Group ID>"

\`\``

 

 

Export bare metal service REST URL:\
<!--\[if !supportLineBreakNewLine]-->\
<!--\[endif]-->

\`\``bash\
# Production Environment:  <https://client.greenlake.hpe.com/api/metal>

\# Integration Environment: <https://client.greenlake.hpe-gl-intg.com/api/metal>

\# local development: <http://localhost:3002>\
\
export HPEGL_METAL_REST_URL="<Metal Service REST Base URL"

\`\``

 

<!--\[if !supportLists]-->**2.**       <!--\[endif]-->**Configure the Terraform provider**

 

Create an empty folder and put a file in it called **main.tf** with the following contents:\
<!--\[if !supportLineBreakNewLine]-->\
<!--\[endif]-->

main.tf:

 

\`\``hcl

 

terraform {

  required_providers {

    hpegl = {

      source  = "HPE/hpegl"

      version = ">= 0.3.12"

    }

  }

}

 

provider "hpegl" {   

\# metal block for configuring bare metal resources.

  metal {  

  }

}

\`\``

 

This tells Terraform that you are going to be using **HPE/hpegl** as your provider and you are using bare metal service.

 

## Write resource configuration for Compute Instance creation

To deploy compute instance, you need to use the *hpegl_metal_host* terraformresource.

Note:

<!--\[if !supportLists]-->·       <!--\[endif]-->compute instance is AKA host.

<!--\[if !supportLists]-->·       <!--\[endif]-->compute instance type is AKA machine size

\
The *hpegl_metal_host* resource supports many different arguments, but these are the required ones:\
<!--\[if !supportLineBreakNewLine]-->\
<!--\[endif]-->

<!--\[if !supportLists]-->·       <!--\[endif]-->Image – A specific flavor and version in the form of flavor@version.

<!--\[if !supportLists]-->·       <!--\[endif]-->location – The location of where the compute instance will be provisioned.

<!--\[if !supportLists]-->·       <!--\[endif]-->machine_size – Compute Instance type.

<!--\[if !supportLists]-->·       <!--\[endif]-->networks – List of networks both required and optional.

<!--\[if !supportLists]-->·       <!--\[endif]-->ssh – List of SSH keys that will be pushed to the host.

       \
           You can also check the documentation [here](https://registry.terraform.io/providers/HPE/hpegl/latest/docs/resources/metal_host) to see required and optional fields.

Your next step with the TF file is to query the HPE GreenLake provider to collect the above required information for creating a host.\
For this, you will use the Terraform data statements. 

\
Querying for available OS images

In order to list the available OS images for OS, add the below data statements in your terraform file main.tf:

\`\``hcl

 

data "hpegl_metal_available_images" "ubuntu" {

\# select anything that looks like ubuntu:20.04

  filter {

    name   = "flavor"

    values = \["(?i)ubuntu"]

  }

 

  filter {

    name   = "version"

    values = \["20.04*"]

  }

}

\`\``             

The OS image list can now be fetched by using:

\`\``hcl

locals {

  ubuntu_image = format("%s@%s", data.hpegl_metal_available_images.ubuntu.images\[0].flavor,

                          data.hpegl_metal_available_images.ubuntu.images\[0].version)

}

\`\``   

         

#### Querying for other available resource

For this, you should use *hpegl_metal_available_resources* data resource.

For example, the following statements shows how to retrieve the available SSH Key lists and store in local variable.

 

\`\``hcl\
# query available resources.

data "hpegl_metal_available_resources" "available" {

}

 

\# using one of available SSH keys.

locals  {

  ssh_keys = data.hpegl_metal_available_resources.available.ssh_keys\[0].name

}

\`\``\
<!--\[if !supportLineBreakNewLine]-->\
<!--\[endif]-->

Using a similar technique, you can retrieve the rest of the data you need - networks, machine_size etc.

\`\``hcl

\# choosing a location that has at least one machine available.

locals {

  location = ([for msize in data.hpegl_metal_available_resources.available.machine_sizes : msize.location

                    if msize.quantity > 0])\[0]

}

 

\# Listing required networks for this location.

locals {

  networks = ([for net in data.hpegl_metal_available_resources.available.networks : net.name

                  if net.host_use == "Required"  && net.location == local.location])

}

 

\# choosing machine size/Compute Instance Type to deploy OS.

locals {

  machine_size = ([for msize in data.hpegl_metal_available_resources.available.machine_sizes : msize.name

                    if msize.location == local.location])

}

\`\``  

[Here](https://registry.terraform.io/providers/HPE/hpegl/latest/docs/data-sources/metal_available_resources) you can get information about each of the bare metal data statements supported by the **hpegl** provider.\
<!--\[if !supportLineBreakNewLine]-->\
<!--\[endif]-->

#### Create Compute Instance

The last step is to define a *hpegl_metal_host* terraform resource to request a new compute instance (Host):

\`\``hcl

resource "hpegl_metal_host" "demo_host" {

  name          = "demo-host-1"

  image         = local.ubuntu_image

  machine_size  = local.machine_size\[0]

  ssh           = \[ local.ssh_keys ]

  networks      = local.networks

  location      = local.location

  description   = "Simple Host Deployment Demo"

}

\`\``                        

##### Initialize Terraform Before you can use Terraform, you will have to initialize it from the configuration file we have created. In the same directory as the **main.tf** file you created, **run : terraform init <!--\[if !supportLineBreakNewLine]--> <!--\[endif]-->**

 **             <!--\[if gte vml 1]><v:shape id="Picture_x0020_20"
 o:spid="_x0000_i1031" type="#_x0000_t75" style='width:451.5pt;height:251.5pt;
 visibility:visible;mso-wrap-style:square'>
 <v:imagedata src="file:///C:\Users\mylarapc\AppData\Local\Temp\msohtmlclip1\01\clip_image015.png"
  o:title=""/>
</v:shape><!\[endif]--><!--\[if !vml]-->![](file:///C:\Users\mylarapc\AppData\Local\Temp\msohtmlclip1\01\clip_image016.jpg)<!--\[endif]-->**



##### Validate and view the Terraform execution plan

Terraform plan is a dry run that lets you preview the changes that Terraform plans to make to your infrastructure based on the data you provide in your Terraform file. To see this, run: ***terraform plan***\
           <!--\[if gte vml 1]><v:shape id="Picture_x0020_15" o:spid="_x0000_i1030"
 type="#_x0000_t75" style='width:562.5pt;height:422.5pt;visibility:visible;
 mso-wrap-style:square'>
 <v:imagedata src="file:///C:\Users\mylarapc\AppData\Local\Temp\msohtmlclip1\01\clip_image017.png"
  o:title=""/>
</v:shape><!\[endif]--><!--\[if !vml]-->![](file:///C:\Users\mylarapc\AppData\Local\Temp\msohtmlclip1\01\clip_image018.jpg)<!--\[endif]-->\
\
           If you agree with the plan, and what is going to be created, you can move to the last step, i.e. applying the configuration.

 

##### Apply the Terraform execution plan

The command you need to use is now: **terraform apply**. This will rerun the plan command, then prompt you to confirm before it starts applying what’s in the plan:\
<!--\[if !supportLineBreakNewLine]-->\
<!--\[endif]-->

           <!--\[if gte vml 1]><v:shape id="Picture_x0020_19" o:spid="_x0000_i1029"
 type="#_x0000_t75" style='width:561.5pt;height:455.5pt;visibility:visible;
 mso-wrap-style:square'>
 <v:imagedata src="file:///C:\Users\mylarapc\AppData\Local\Temp\msohtmlclip1\01\clip_image019.png"
  o:title=""/>
</v:shape><!\[endif]--><!--\[if !vml]-->![](file:///C:\Users\mylarapc\AppData\Local\Temp\msohtmlclip1\01\clip_image020.jpg)<!--\[endif]-->

           <!--\[if gte vml 1]><v:shape id="Picture_x0020_22" o:spid="_x0000_i1028"
 type="#_x0000_t75" style='width:560pt;height:50.5pt;visibility:visible;
 mso-wrap-style:square'>
 <v:imagedata src="file:///C:\Users\mylarapc\AppData\Local\Temp\msohtmlclip1\01\clip_image021.png"
  o:title=""/>
</v:shape><!\[endif]--><!--\[if !vml]-->![](file:///C:\Users\mylarapc\AppData\Local\Temp\msohtmlclip1\01\clip_image022.jpg)<!--\[endif]-->

          If you open your HPE GreenLake console and navigate to Compute Group view, you will see that the new compute Instance has been created successfully.

##            <!--\[if gte vml 1]><v:shape id="Picture_x0020_24" o:spid="_x0000_i1027"  type="#_x0000_t75" style='width:627.5pt;height:256pt;visibility:visible;  mso-wrap-style:square'>  <v:imagedata src="file:///C:\Users\mylarapc\AppData\Local\Temp\msohtmlclip1\01\clip_image023.png"   o:title=""/> </v:shape><!\[endif]--><!--\[if !vml]-->![](file:///C:\Users\mylarapc\AppData\Local\Temp\msohtmlclip1\01\clip_image024.jpg)<!--\[endif]--> Advanced example:

The above example shows how to deploy a compute instance from the pre-existing resource. Below is another example that demonstrates compute instance deployment

with dependency on dynamic resources and few other possible configuration options.

 

\`\``hcl

terraform {

  required_providers {

    hpegl = {

      source  = "HPE/hpegl"

      version = ">= 0.3.12"

    }

  }

}

 

provider "hpegl" {   

\# metal block for configuring bare metal resources.

  metal {  

  }

}\
<!--\[if !supportLineBreakNewLine]-->\
<!--\[endif]-->

locals {

  location = "USA:CO:FTC"

}

 

resource "hpegl_metal_ssh_key" "newssh_1" {

  name       = "newssh_1"

  public_key = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQCv03o//GEQ9/6eI1qZleyBbSndg0n5AkcKVnf5D4fEjwkWrtSIJEnROqJddEAn2XYALAk9x1AcB4Nue3q4tDG17VeK3ODo0+9Dx0LYqUTawnFWmo4X80QKr658Jmt7Enmnk5x2IrUDcNwAzALVellkBbwq7QbYUu1swSycNlNhSfGizqo/lQCNIHXyeRQ8oJxOuZkbiturXHZL389blIrTeUo53xmwE1TolVS8QzZRN8ve1GjFvpC5dl6orzi6LXDcrDcbZaxlrW+YQqyaipFRAw1DyTalrfpqxtq/Y9+Elz5xgCnUaepHN6ha/k81wtI2rySHga6pMOcJKlxaRS5OfzdrWh7oi2tEAaiq2y3pTr9hROQ2OGcMNU5gxbVU2ymeXdHVsAHMCmyKvQe0g0/fJzmNA/excogFCWDN7Spy9s2V39IbEKttyXjD/dpave7re9eFzYHA1CBEnNjMuvJj0H4tnpAETdQ6UbnjbE4JYn5eKGvnJ2w1JTfSdMK8nMcxqo4HfHWuLFuntCV9GAlWIVIvJn1pYisY8kEOtN5w6QrLTfsei96/TfssAsfhrDrVtgcgNU3EvZlC6Uaaly7D0ISFeufsxkPswu+jGNUJvGEqDiqvt05lSEZWS5viR/TOROTlicaGN9dhez/fqHcj5cnuoK1pmibK5GT7/Yf1Gw== user1@quattronetworks.com"

}

 

resource "hpegl_metal_network" "newpnet_1" {

  name        = "newpnet_1"

  description = "New private network 1 description"

  location    = local.location

  ip_pool {

    name          = "npool"

    description   = "New IP pool description"

    ip_ver        = "IPv4"

    base_ip       = "10.0.0.0"

    netmask       = "/24"

    default_route = "10.0.0.1"

    sources {

      base_ip = "10.0.0.3"

      count   = 10

    }

    dns      = \["10.0.0.50"]

    proxy    = "https://10.0.0.60"

    no_proxy = "10.0.0.5"

    ntp      = \["10.0.0.80"]

  }

}

 

 

resource "hpegl_metal_host" "demo_advance" {

  count = 0

  name             = "demo-advance-1"

  image            = "ubuntu@20.04-20210713"

  machine_size     = "G2i"

  ssh              = \[hpegl_metal_ssh_key.newssh_1.id]

  networks         = \["Public", hpegl_metal_network.newpnet_1.name]

  network_route    = "Public"

  network_untagged = hpegl_metal_network.newpnet_1.name

  location         = local.location

  description      = "Hello from Terraform"

\# Attaching tags

  labels           = { "purpose" = "devops" }

}

\`\``            

# Cleaning up resources

When you no longer need the resources created via Terraform, destroy the resources using the **terraform** **destroy** command.\
This will automatically use the HPE GreenLake provider to clean the infrastructure in HPE GreenLake.\
<!--\[if !supportLineBreakNewLine]-->\
<!--\[endif]-->

<!--\[if gte vml 1]><v:shape id="Picture_x0020_17" o:spid="_x0000_i1026"
 type="#_x0000_t75" style='width:541pt;height:91.5pt;visibility:visible;
 mso-wrap-style:square'>
 <v:imagedata src="file:///C:\Users\mylarapc\AppData\Local\Temp\msohtmlclip1\01\clip_image025.png"
  o:title=""/>
</v:shape><!\[endif]--><!--\[if !vml]-->![](file:///C:\Users\mylarapc\AppData\Local\Temp\msohtmlclip1\01\clip_image026.jpg)<!--\[endif]-->\
<!--\[if gte vml 1]><v:shape
 id="Picture_x0020_21" o:spid="_x0000_i1025" type="#_x0000_t75" style='width:542pt;
 height:473.5pt;visibility:visible;mso-wrap-style:square'>
 <v:imagedata src="file:///C:\Users\mylarapc\AppData\Local\Temp\msohtmlclip1\01\clip_image027.png"
  o:title=""/>
</v:shape><!\[endif]--><!--\[if !vml]-->![](file:///C:\Users\mylarapc\AppData\Local\Temp\msohtmlclip1\01\clip_image028.jpg)<!--\[endif]-->          

\
Summary

In this blog, I covered how to provision a compute instance with Terraform provider for HPE GreenLake using bare metal resources. I also showed you advanced usage of **hpegl** resource statements to deploy compute instance with dynamic resources.

I hope you found this information interesting and useful in helping you get started with HPE GreenLake Terraform provider. You can also go through the below links to understand more about the HPE GreenLake Terraform Provider.

<!--\[if !supportLists]-->·       <!--\[endif]-->[Learn more about the HPE GreenLake Terraform provider](https://registry.terraform.io/providers/hpe/hpegl/latest)

<!--\[if !supportLists]-->·       <!--\[endif]-->[Kubernetes Cluster as Code – Part 1](https://developer.hpe.com/blog/kubernetes-clusters-as-code-part1/)

<!--\[if !supportLists]-->·       <!--\[endif]-->[Kubernetes Cluster as Code – Part 2](https://developer.hpe.com/blog/kubernetes-cluster-as-code-part-2/)

<!--EndFragment-->