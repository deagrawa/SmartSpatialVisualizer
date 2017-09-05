package com.sap.pia.producer;

import java.sql.Connection;
import java.sql.SQLException;
import java.sql.SQLIntegrityConstraintViolationException;
import java.sql.SQLTimeoutException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.Map;
import javax.naming.NamingException;
import org.core4j.Enumerable;
import org.odata4j.core.OEntity;
import org.odata4j.core.OEntityKey;
import org.odata4j.edm.EdmDataServices;
import org.odata4j.edm.EdmEntitySet;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class UpdateData
{

	private String dataBase;
	private String appTable;
	private EdmDataServices metaDataObj;
	/** jdbc connection */
	private Connection connection;
	/** jdbc operation assistant */
	private JdbcOperator jdbc;
	GetMetaData getMetaData;
	OdataDataDao appDataDao;

	/**
	 * Member variables which will be read from properties files
	 */
	private Map<String, String> propertiesMap;

	/**
	 * Static constant Logger object used for adding various logs .
	 */
	private static final Logger LOGGER= LoggerFactory.getLogger(UpdateData.class);

	UpdateData(EdmDataServices metadata)
	{
		try
		{
			appDataDao= new OdataDataDao();

			propertiesMap= OdataUtility.getPropertiesMap();
			dataBase= propertiesMap.get("dataBase");
			appTable=propertiesMap.get("applicationTable");
			jdbc= new JdbcOperator();
			metaDataObj= metadata;

		}
		catch(NamingException e)
		{
			LOGGER.error(OdataUtility.getStackTrace(e));
		}
	}

	/**
	 * updateRow method used to update a row for a given table with condition clause.
	 * 
	 * @param entitySetName
	 *            Table name
	 * @param entity
	 *            Table columns and new values
	 * @return
	 *			  
	 */
	public void updateRow(String entitySetName, OEntity entity)
	{
		EdmEntitySet ees= metaDataObj.getEdmEntitySet(entitySetName);

		ArrayList<String> names= jdbc.getNamesFromEntity(entity);
		ArrayList<String> values= jdbc.getValuesFromEntity(entity);

		ArrayList<String> setList= new ArrayList<String>();
		int i= 0;
		for(String name : names)
		{
			String set= name + "=" + values.get(i);
			setList.add(set);
			i++;
		}
		String setString= Enumerable.create(setList).join(",");

		String keyField= ees.getType().getKeys().get(0);
		String keyValue= entity.getProperty(keyField).getValue().toString();

		String sql= "UPDATE " + dataBase + "." + entitySetName + " SET " + setString + " WHERE " + keyField + "='" + keyValue + "'";
		System.out.println("Query SQL: " + sql);
		try
		{
			connection= appDataDao.getConnection();
			Statement st= connection.createStatement();
			st.executeUpdate(sql);
			st.close();
		}
		catch(SQLTimeoutException e)
		{
			LOGGER.error(OdataUtility.getStackTrace(e));
		}
		catch(SQLIntegrityConstraintViolationException e)
		{
			LOGGER.error(OdataUtility.getStackTrace(e));
		}
		catch(NullPointerException e)
		{
			LOGGER.error(OdataUtility.getStackTrace(e));
		}
		catch(SQLException e)
		{
			LOGGER.error(OdataUtility.getStackTrace(e));
		}
		catch(ClassNotFoundException e)
		{
			LOGGER.error(OdataUtility.getStackTrace(e));
		}
		finally
		{
			OdataUtility.safeClose(connection);
		}
	}

	/**
	 * deleteRow method used to delete a row for a given table with condition clause.
	 * 
	 * @param entitySetName
	 *            Table name
	 * @param entityKey
	 *            Constraint name and value
	 * @return
	 *			  
	 */
	public void deleteRow(String entitySetName, OEntityKey entityKey)
	{
		EdmEntitySet ees= metaDataObj.getEdmEntitySet(entitySetName);
		// String keyField = ees.type.keys.get(0);
		String keyField= ees.getType().getKeys().get(0);
		String keyValue= entityKey.asSingleValue().toString();
		String viewPrefix="";
		String viewPackageName= "";
		try
		{

			connection= appDataDao.getConnection();
			Statement st= connection.createStatement();

			if(entitySetName.equalsIgnoreCase(appTable))
			{
				viewPrefix=propertiesMap.get("viewPrefix");
				viewPackageName=propertiesMap.get("viewPackageName");
				DeleteViews deleteViews= new DeleteViews();
				deleteViews.delViews(keyValue, viewPrefix, viewPackageName, connection);

				String deleteAppMetaData= "DELETE FROM " + dataBase + "." + "CUSTOMCOLUMNMETADATA" + " WHERE " + keyField + "='" + keyValue + "'";
				String deleteAppCommonData= "DELETE FROM " + dataBase + "." + "COMMONFACTS" + " WHERE APPLICATIONID" + "='" + keyValue + "'";
				String deleteAppId= "DELETE FROM " + dataBase + "." + "APPLICATION" + " WHERE " + keyField + "='" + keyValue + "'";
				String deleteAppTable= "DROP TABLE " + dataBase + "." + "\"UT_" + keyValue + "\"";
				st.executeUpdate(deleteAppMetaData);
				st.executeUpdate(deleteAppCommonData);
				st.executeUpdate(deleteAppId);
				st.executeUpdate(deleteAppTable);
				st.close();
			}
			else
			{
				String sql= "DELETE FROM " + dataBase + "." + entitySetName + " WHERE " + keyField + "='" + keyValue + "'";
				System.out.println("Query SQL: " + sql);
				st.executeUpdate(sql);
				st.close();
			}
		}
		catch(SQLTimeoutException e)
		{
			LOGGER.error(OdataUtility.getStackTrace(e));
		}
		catch(SQLIntegrityConstraintViolationException e)
		{
			LOGGER.error(OdataUtility.getStackTrace(e));
		}
		catch(NullPointerException e)
		{
			LOGGER.error(OdataUtility.getStackTrace(e));
		}
		catch(SQLException e)
		{
			LOGGER.error(OdataUtility.getStackTrace(e));
		}
		catch(ClassNotFoundException e)
		{
			LOGGER.error(OdataUtility.getStackTrace(e));
		}
		finally
		{
			OdataUtility.safeClose(connection);
		}
	}

}
